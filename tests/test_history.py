"""History integration scenarios using local HTTP; never a private Tracearr key.

Home Assistant coordinator/entity interfaces are small doubles, as HA is not a
test dependency of this repository. The API requests use real aiohttp sockets.
"""
import ast
import asyncio
import importlib.util
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

import pytest
from aiohttp import ClientSession, web

ROOT = Path(__file__).resolve().parents[1] / "custom_components/tracearr_ha"
spec = importlib.util.spec_from_file_location("history_test_api", ROOT / "api.py")
api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api)


class UpdateFailed(Exception):
    pass


class Coordinator:
    def __class_getitem__(cls, item):
        return cls

    def __init__(self, hass, logger, **kwargs):
        self.data = None
        self.last_update_success = False
        self.update_interval = kwargs["update_interval"]
        self.hass = hass

    async def async_refresh(self):
        try:
            self.data = await self._async_update_data()
            self.last_update_success = True
        except UpdateFailed:
            self.last_update_success = False


def load_history():
    tree = ast.parse((ROOT / "history.py").read_text(encoding="utf-8"))
    tree.body = [n for n in tree.body if not (isinstance(n, ast.ImportFrom) and
                 (n.level or n.module.startswith("homeassistant")))]
    scope = {"DataUpdateCoordinator": Coordinator, "UpdateFailed": UpdateFailed,
             "TracearrAuthError": api.TracearrAuthError,
             "TracearrUnavailable": api.TracearrUnavailable,
             "async_sign_path": lambda hass, path, expiration: path + "?authSig=test-signature"}
    exec(compile(tree, str(ROOT / "history.py"), "exec"), scope)
    return SimpleNamespace(**scope)


history = load_history()
SID = history.RECKPLEX_SERVER_ID
NOW = datetime(2026, 11, 10, 16, 30, tzinfo=timezone.utc)


def play(**changes):
    return {"server_id": SID, "watched": True, "media_type": "movie",
            "media_id": "movie-a", "media_title": "Movie A", "year": 2004,
            "poster_url": "/poster/a.jpg", "started_at": NOW.isoformat(), **changes}


def test_rolling_window_server_watched_and_media_filters():
    cutoff = NOW - timedelta(days=30)
    rows = [play(id="boundary", started_at=cutoff.isoformat()),
            play(id="now"),
            play(id="offset", started_at="2026-10-11T10:30:00-06:00"),
            play(started_at=(cutoff - timedelta(microseconds=1)).isoformat()),
            play(started_at=(NOW + timedelta(seconds=1)).isoformat()),
            play(started_at="2026-11-10T16:30:00"),
            play(started_at="invalid"), play(started_at=None),
            play(server_id="other"), play(watched=False), play(watched="true"),
            play(media_type="track")]
    result = history.rank_history(rows, SID, NOW, "https://tracearr.example")
    assert result["movie"][0]["count"] == 3
    assert result["since"] == cutoff.isoformat()
    assert result["episode"] == []


def test_grouping_ids_show_fallback_repeated_plays_and_top_five():
    rows = [play(id="1"), play(id="2"), play(id="2"),
            play(id="3", media_id="remake", year=2026),
            play(id="4", media_type="episode", show_media_id="show-a", show_title="Show", media_id="episode-1"),
            play(id="5", media_type="episode", show_media_id="show-a", show_title="Show", media_id="episode-2"),
            play(media_type="episode", show_title="Fallback", year=2020),
            play(media_type="episode", show_title="fallback", year=2021)]
    rows += [play(media_id=f"m{i}", media_title=f"Title {i}") for i in range(8)]
    result = history.rank_history(rows, SID, NOW, "https://tracearr.example")
    assert len(result["movie"]) == 5
    assert result["movie"][0]["count"] == 2
    assert result["movie"][0]["year"] == 2004
    assert result["movie"][0]["artwork"] == "https://tracearr.example/poster/a.jpg"
    assert {r["title"].casefold(): r["count"] for r in result["episode"]} == {"show": 2, "fallback": 2}
    assert all(r["year"] is None for r in result["episode"])


def test_missing_movie_id_falls_back_to_title_and_year():
    rows = [play(media_id=None), play(media_id=None, media_title="movie a"),
            play(media_id=None, year=2026)]
    assert [r["count"] for r in history.rank_history(rows, SID, NOW, "https://example.com")["movie"]] == [2, 1]


@pytest.mark.parametrize("url", ["javascript:alert(1)", "https://user:secret@example.com/a",
                                  "/a?api_key=secret", "/a?X-Plex-Token=secret", None])
def test_artwork_does_not_publish_credentials(url):
    assert history.artwork_url(url, "https://example.com") is None


async def serve(handler, callback):
    app = web.Application()
    app.router.add_get("/api/v2/public/history", handler)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "127.0.0.1", 0)
    await site.start()
    port = site._server.sockets[0].getsockname()[1]
    try:
        async with ClientSession() as session:
            await callback(api.TracearrClient(session, f"http://127.0.0.1:{port}", "TEST_SECRET"))
    finally:
        await runner.cleanup()


def test_short_pages_cursor_encoding_filters_and_date_ignored_by_server():
    requests = []
    async def handler(request):
        requests.append(dict(request.query))
        assert request.headers["Authorization"] == "Bearer TEST_SECRET"
        assert request.query["server_id"] == SID
        assert request.query["watched"] == "true"
        assert request.query["since"] == "2026-10-11"
        assert request.query["page_size"] == "100"
        page = len(requests)
        if page == 1:
            rows = [play(id=str(i)) for i in range(25)]
            cursor = "opaque+/= &?"
        elif page == 2:
            assert request.query["cursor"] == "opaque+/= &?"
            # Server ignores since and watched: local enforcement remains correct.
            rows = [play(id="25", media_id="b", media_title="B")]
            rows += [play(id="old", started_at="2020-01-01T00:00:00Z")]
            rows += [play(id="unwatched", watched=False)]
            cursor = "last"
        else:
            rows, cursor = [], None
        return web.json_response({"data": rows, "meta": {"nextCursor": cursor}})

    async def check(client):
        rows = await client.history(SID, "2026-10-11")
        result = history.rank_history(rows, SID, NOW, client.base_url)
        assert [(r["title"], r["count"]) for r in result["movie"]] == [("Movie A", 25), ("B", 1)]
        assert len(requests) == 3
        assert "cursor" not in requests[0]
    asyncio.run(serve(handler, check))


@pytest.mark.parametrize("status,error", [(401, api.TracearrAuthError), (403, api.TracearrAuthError),
                                           (429, api.TracearrRateLimited), (500, api.TracearrUnavailable)])
def test_http_failures_do_not_expose_response_body_or_key(status, error, caplog):
    async def handler(request):
        return web.Response(status=status, text="TEST_SECRET", headers={"Retry-After": "60"})
    async def check(client):
        with pytest.raises(error) as exc:
            await client.history(SID, "2026-10-11")
        assert "TEST_SECRET" not in str(exc.value)
        assert "TEST_SECRET" not in caplog.text
    asyncio.run(serve(handler, check))


@pytest.mark.parametrize("payload", [{}, {"data": [], "meta": {}},
    {"data": {}, "meta": {"nextCursor": None}},
    {"data": [None], "meta": {"nextCursor": None}},
    {"data": [], "meta": {"nextCursor": 5}}])
def test_malformed_history_is_not_reported_as_empty_success(payload):
    async def handler(request):
        return web.json_response(payload)
    async def check(client):
        with pytest.raises(api.TracearrUnavailable):
            await client.history(SID, "2026-10-11")
    asyncio.run(serve(handler, check))


def test_repeated_cursor_cycle_and_page_limit(monkeypatch):
    async def scenario(cursors, max_pages, expected_calls):
        calls = 0
        async def handler(request):
            nonlocal calls
            cursor = cursors[calls % len(cursors)]
            calls += 1
            return web.json_response({"data": [], "meta": {"nextCursor": cursor}})
        async def check(client):
            with pytest.raises(api.TracearrUnavailable):
                await client.history(SID, "2026-10-11")
            assert calls == expected_calls
        monkeypatch.setattr(api, "HISTORY_MAX_PAGES", max_pages)
        await serve(handler, check)
    asyncio.run(scenario(["a"], 1000, 2))
    asyncio.run(scenario(["a", "b"], 1000, 3))
    asyncio.run(scenario(["a", "b", "c", "d"], 3, 3))


def test_failure_on_later_page_retains_cache_and_recovers():
    phase, calls = "ok", 0
    async def handler(request):
        nonlocal calls
        calls += 1
        if phase == "failed" and request.query.get("cursor"):
            return web.Response(status=500, text="TEST_SECRET")
        return web.json_response({"data": [play(id=str(calls), started_at=(datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat())],
                                  "meta": {"nextCursor": "second" if phase == "failed" else None}})
    async def check(client):
        nonlocal phase
        coordinator = history.TracearrHistoryCoordinator(None, client)
        assert coordinator.update_interval == timedelta(hours=6)
        await coordinator.async_refresh()
        previous = coordinator.data
        assert coordinator.last_update_success
        phase = "failed"
        await coordinator.async_refresh()
        assert not coordinator.last_update_success
        assert coordinator.data is previous
        phase = "ok"
        await coordinator.async_refresh()
        assert coordinator.last_update_success
    asyncio.run(serve(handler, check))


def test_coordinator_auth_error_is_sanitized():
    async def fail(*args):
        raise api.TracearrAuthError("TEST_SECRET")
    coordinator = history.TracearrHistoryCoordinator(None, SimpleNamespace(history=fail))
    with pytest.raises(UpdateFailed) as exc:
        asyncio.run(coordinator._async_update_data())
    assert "authentication failed" in str(exc.value)
    assert "TEST_SECRET" not in str(exc.value)
    assert exc.value.__suppress_context__


def test_coordinator_proxies_artwork_without_exposing_tracearr_credentials():
    async def rows(*args):
        return [play(started_at=(datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat(),
                     poster_url="/api/v1/images/proxy?server=reckplex&url=poster")]
    coordinator = history.TracearrHistoryCoordinator(None, SimpleNamespace(
        history=rows, base_url="https://tracearr.example"), "entry")
    result = asyncio.run(coordinator._async_update_data())
    assert result["movie"][0]["artwork"] == "/api/tracearr_ha/image/entry/history-movie-0/poster?authSig=test-signature"
    assert coordinator.artwork_sources["history-movie-0"]["poster_url"].startswith("https://tracearr.example/")


def test_timeout_does_not_publish_partial_history(monkeypatch):
    from aiohttp import ClientTimeout
    monkeypatch.setattr(api, "ClientTimeout", lambda **kwargs: ClientTimeout(total=0.01))
    async def handler(request):
        await asyncio.sleep(0.05)
        return web.json_response({"data": [], "meta": {"nextCursor": None}})
    async def check(client):
        with pytest.raises(api.TracearrUnavailable, match="request failed"):
            await client.history(SID, "2026-10-11")
    asyncio.run(serve(handler, check))


def test_malformed_json_makes_history_unavailable():
    async def handler(request):
        return web.Response(text="not JSON TEST_SECRET")
    async def check(client):
        coordinator = history.TracearrHistoryCoordinator(None, client)
        with pytest.raises(UpdateFailed) as exc:
            await coordinator._async_update_data()
        assert "TEST_SECRET" not in str(exc.value)
        assert exc.value.__suppress_context__
    asyncio.run(serve(handler, check))


def test_sensor_title_attributes_empty_and_unavailable():
    class Entity:
        def __init__(self, coordinator):
            self.coordinator = coordinator
        @property
        def available(self):
            return self.coordinator.last_update_success
    tree = ast.parse((ROOT / "sensor.py").read_text(encoding="utf-8"))
    cls = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "TracearrTopMediaSensor")
    scope = {"CoordinatorEntity": Entity, "SensorEntity": type("Sensor", (), {}),
             "DOMAIN": "tracearr_ha", "RECKPLEX_SERVER_ID": SID}
    exec(compile(ast.Module(body=[cls], type_ignores=[]), "sensor.py", "exec"), scope)
    coordinator = SimpleNamespace(data=history.rank_history([play()], SID, NOW, "https://example.com"), last_update_success=True)
    sensor = scope["TracearrTopMediaSensor"](coordinator, SimpleNamespace(entry_id="entry"), "movie")
    assert sensor.native_value == "Movie A"
    assert sensor.extra_state_attributes["count"] == 1
    assert sensor.entity_picture == "https://example.com/poster/a.jpg"
    assert len(sensor.extra_state_attributes["top_five"]) == 1
    assert sensor.available
    coordinator.last_update_success = False
    assert not sensor.available
    coordinator.data = {"movie": []}
    assert sensor.native_value is None
    assert sensor.extra_state_attributes["count"] == 0
    assert sensor.entity_picture is None
    coordinator.data = None
    coordinator.last_update_success = True
    assert not sensor.available


def test_history_startup_does_not_block_live_setup_and_cancels_on_unload():
    tree = ast.parse((ROOT / "sensor.py").read_text(encoding="utf-8"))
    setup = next(n for n in tree.body if isinstance(n, ast.AsyncFunctionDef) and n.name == "async_setup_entry")
    async def scenario():
        gate = asyncio.Event()
        cancelled = asyncio.Event()
        class SlowHistory:
            def __init__(self, *args):
                pass
            async def async_refresh(self):
                try:
                    await gate.wait()
                finally:
                    cancelled.set()
        tasks, unloaders, added = [], [], []
        def create_task(coro, name, **kwargs):
            task = asyncio.create_task(coro)
            tasks.append(task)
            return task
        live = SimpleNamespace(client=object(), servers={}, async_add_listener=lambda fn: lambda: None)
        hass = SimpleNamespace(data={"tracearr_ha": {"entry": live}}, async_create_background_task=create_task)
        entry = SimpleNamespace(entry_id="entry", async_on_unload=unloaders.append)
        scope = {"DOMAIN": "tracearr_ha", "STAT_TYPES": {"total": None},
                 "TracearrStatsSensor": lambda *args: "existing-live-sensor",
                 "TracearrTopMediaSensor": lambda *args: "new-history-sensor",
                 "TracearrHistoryCoordinator": SlowHistory}
        exec(compile(ast.Module(body=[setup], type_ignores=[]), "sensor.py", "exec"), scope)
        await asyncio.wait_for(scope["async_setup_entry"](hass, entry, added.extend), 0.1)
        assert added == ["existing-live-sensor", "new-history-sensor", "new-history-sensor"]
        await asyncio.sleep(0)
        for unload in unloaders:
            unload()
        await asyncio.gather(*tasks, return_exceptions=True)
        assert cancelled.is_set()
    asyncio.run(scenario())
