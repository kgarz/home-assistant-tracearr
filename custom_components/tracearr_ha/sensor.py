"""Tracearr global statistics sensors."""
from __future__ import annotations

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.const import UnitOfDataRate
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .history import RECKPLEX_SERVER_ID, TracearrHistoryCoordinator

STAT_TYPES = {
    "total": ("Active streams", "mdi:play-network", None),
    "playing": ("Playing streams", "mdi:play", None),
    "paused": ("Paused streams", "mdi:pause", None),
    "direct": ("Direct streams", "mdi:video-check", None),
    "video": ("Video-only transcodes", "mdi:filmstrip", None),
    "audio": ("Audio-only transcodes", "mdi:music-note", None),
    "both": ("Video and audio transcodes", "mdi:video-wireless", None),
    "transcodes": ("Total transcodes", "mdi:swap-horizontal", None),
    "unknown": ("Unknown playback decision", "mdi:help-network", None),
    "bandwidth_mbps": ("Stream bandwidth", "mdi:speedometer", "Mbit/s"),
}

async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([TracearrStatsSensor(coordinator, entry, key) for key in STAT_TYPES])
    known: set[str] = set()

    def add_servers():
        created = []
        for server in coordinator.servers.values():
            sid = server["server_id"]
            if sid not in known:
                known.add(sid)
                created.append(TracearrServerStreams(coordinator, entry, sid))
        if created:
            async_add_entities(created)

    add_servers()
    entry.async_on_unload(coordinator.async_add_listener(add_servers))
    history = TracearrHistoryCoordinator(hass, coordinator.client, entry.entry_id)
    coordinator.history = history
    # A history outage must not prevent the existing live sensors from loading.
    async_add_entities([TracearrTopMediaSensor(history, entry, kind) for kind in ("movie", "episode")])
    task = hass.async_create_background_task(history.async_refresh(), "Tracearr history first refresh", eager_start=False)
    entry.async_on_unload(task.cancel)


class TracearrTopMediaSensor(CoordinatorEntity, SensorEntity):
    """Title of the most watched movie/show, with the top five as attributes."""

    _attr_has_entity_name = True

    def __init__(self, coordinator, entry, kind):
        super().__init__(coordinator)
        self.kind = kind
        self._attr_translation_key = "top_movie_30_days" if kind == "movie" else "top_show_30_days"
        self._attr_icon = "mdi:movie" if kind == "movie" else "mdi:television"
        self._attr_unique_id = f"{entry.entry_id}_{RECKPLEX_SERVER_ID}_top_{kind}_30_days"
        self._attr_device_info = {"identifiers": {(DOMAIN, RECKPLEX_SERVER_ID)}, "name": "Reckplex", "manufacturer": "Tracearr", "model": "plex"}

    @property
    def ranking(self):
        return (self.coordinator.data or {}).get(self.kind, [])

    @property
    def available(self):
        return self.coordinator.data is not None and self.coordinator.last_update_success

    @property
    def native_value(self):
        return self.ranking[0]["title"][:255] if self.ranking else None

    @property
    def entity_picture(self):
        return self.ranking[0]["artwork"] if self.ranking else None

    @property
    def extra_state_attributes(self):
        data = self.coordinator.data or {}
        top = self.ranking[0] if self.ranking else {}
        return {"count": top.get("count", 0), "year": top.get("year"),
                "artwork": top.get("artwork"), "top_five": self.ranking,
                "server_id": RECKPLEX_SERVER_ID, "window_days": 30,
                "since": data.get("since"), "last_updated": data.get("until")}


class TracearrStatsSensor(CoordinatorEntity, SensorEntity):
    _attr_has_entity_name = True
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, key):
        super().__init__(coordinator)
        self.key = key
        name, icon, unit = STAT_TYPES[key]
        self._attr_name = name
        self._attr_icon = icon
        self._attr_native_unit_of_measurement = unit
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = {"identifiers": {(DOMAIN, entry.entry_id)}, "name": "Tracearr", "manufacturer": "Tracearr", "model": "Public API v2"}

    @property
    def native_value(self):
        return (self.coordinator.data or {}).get("stats", {}).get(self.key)

    @property
    def available(self):
        return self.coordinator.connected and self.coordinator.last_update_success


class TracearrServerStreams(CoordinatorEntity, SensorEntity):
    """Number of active streams per media server."""
    _attr_has_entity_name = True
    _attr_name = "Active streams"
    _attr_icon = "mdi:play-network"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, entry, server_id):
        super().__init__(coordinator)
        self.server_id = server_id
        self._attr_unique_id = f"{entry.entry_id}_{server_id}_streams"
        server = coordinator.servers.get(server_id, {})
        self._attr_device_info = {"identifiers": {(DOMAIN, server_id)}, "name": server.get("server_name", "Media server"), "manufacturer": "Tracearr", "model": server.get("server_type", "Media server")}

    @property
    def native_value(self):
        return sum(s.get("server_id") == self.server_id for s in self.coordinator.streams.values())

    @property
    def available(self):
        return self.coordinator.connected and self.coordinator.last_update_success
