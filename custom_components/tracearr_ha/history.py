"""Rolling watched-play rankings, independent of the live stream cache."""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from urllib.parse import urljoin, urlsplit, parse_qsl

from homeassistant.components.http.auth import async_sign_path
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import TracearrAuthError, TracearrUnavailable

RECKPLEX_SERVER_ID = "edf9a1e3-7fe4-4a5e-9fae-521201563900"
HISTORY_INTERVAL = timedelta(hours=6)
_LOGGER = logging.getLogger(__name__)


def artwork_url(value, base_url):
    """Resolve public artwork without attaching API credentials."""
    if not isinstance(value, str) or not value:
        return None
    url = urljoin(base_url.rstrip("/") + "/", value)
    parsed = urlsplit(url)
    if (parsed.scheme not in {"http", "https"} or not parsed.netloc
            or parsed.username or parsed.password
            or any(k.lower() in {"token", "api_key", "apikey", "x-plex-token", "authorization"}
                   for k, _ in parse_qsl(parsed.query))):
        return None
    return url


def rank_history(rows, server_id, now, base_url):
    """Count plays starting in [now-30 days, now], enforcing filters locally."""
    since = now - timedelta(days=30)
    groups = {"movie": {}, "episode": {}}
    seen = set()
    for row in rows:
        kind = row.get("media_type")
        if (row.get("server_id") != server_id or row.get("watched") is not True
                or kind not in groups):
            continue
        try:
            started = datetime.fromisoformat(row["started_at"].replace("Z", "+00:00"))
            if started.tzinfo is None or not since <= started <= now:
                continue
        except (KeyError, TypeError, ValueError, AttributeError):
            continue
        play_id = row.get("id")
        if isinstance(play_id, str) and play_id:
            if play_id in seen:
                continue
            seen.add(play_id)
        title = row.get("show_title" if kind == "episode" else "media_title")
        if not isinstance(title, str) or not title.strip():
            continue
        title = title.strip()
        media_id = row.get("show_media_id" if kind == "episode" else "media_id")
        year = row.get("show_year" if kind == "episode" else "year")
        # Never split a show by episode year, nor label it with an episode year.
        key = ("id", str(media_id)) if media_id else ("title", title.casefold(), year if kind == "movie" else None)
        group = groups[kind].setdefault(key, {
            "title": title, "count": 0, "year": year,
            "media_id": media_id,
            "artwork": artwork_url(row.get("show_poster_url") or row.get("poster_url"), base_url),
        })
        group["count"] += 1
    return {
        "since": since.isoformat(), "until": now.isoformat(), "server_id": server_id,
        **{kind: sorted(values.values(), key=lambda g: (-g["count"], g["title"].casefold(), str(g["media_id"]), str(g["year"])))[:5]
           for kind, values in groups.items()},
    }


class TracearrHistoryCoordinator(DataUpdateCoordinator[dict]):
    """Refresh only history sensors every six hours; failures retain old cache."""

    def __init__(self, hass, client, entry_id=None):
        super().__init__(hass, _LOGGER, name="Tracearr Reckplex history",
                         update_interval=HISTORY_INTERVAL)
        self.client = client
        self.entry_id = entry_id
        self.artwork_sources = {}

    async def _async_update_data(self):
        now = datetime.now(timezone.utc)
        # Date-only since is supported by the observed API. Enforce the exact
        # rolling UTC instant locally even if Tracearr ignores its date filter.
        since = (now - timedelta(days=30)).date().isoformat()
        try:
            async with asyncio.timeout(300):
                rows = await self.client.history(RECKPLEX_SERVER_ID, since)
            result = rank_history(rows, RECKPLEX_SERVER_ID, now, self.client.base_url)
            sources = {}
            if self.entry_id is not None:
                for kind in ("movie", "episode"):
                    for index, item in enumerate(result[kind]):
                        if item["artwork"]:
                            image_id = f"history-{kind}-{index}"
                            sources[image_id] = {"poster_url": item["artwork"]}
                            path = f"/api/tracearr_ha/image/{self.entry_id}/{image_id}/poster"
                            item["artwork"] = async_sign_path(self.hass, path, timedelta(hours=7))
            self.artwork_sources = sources
            return result
        except TracearrAuthError:
            raise UpdateFailed("Tracearr history authentication failed; check the configured API key") from None
        except (TracearrUnavailable, TimeoutError, ValueError, TypeError):
            raise UpdateFailed("Tracearr history refresh failed; no partial ranking published") from None
