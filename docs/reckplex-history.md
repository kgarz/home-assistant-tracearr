# Reckplex rolling 30-day sensors (local v0.1.16 enhancement)

This package extends Moosketair/home-assistant-tracearr v0.1.16, commit
443ce3859d09b67ccfd589d326d032753dc11d64. It is a local enhancement, not an
official upstream release. Existing configuration entries, live sensor unique
IDs, stream polling, SSE and card JavaScript are retained. The manifest remains
0.1.16 so this package does not claim an upstream version number.

## Install over your existing v0.1.16

1. Make a Home Assistant backup. Also copy your current
   `/config/custom_components/tracearr_ha` folder somewhere outside
   `/config/custom_components` so you can restore it easily.
2. Extract the supplied ZIP on your computer. Copy its entire
   `custom_components/tracearr_ha` folder to `/config/custom_components/tracearr_ha`,
   replacing matching files. Do not create a nested `tracearr_ha/tracearr_ha` folder.
   The ZIP also contains source tests and documentation; those do not need to be
   copied into Home Assistant.
3. Restart Home Assistant. Keep your existing Tracearr integration entry and API
   key; no YAML configuration or additional key is needed.
4. In Settings > Devices & services > Tracearr HA, find the Reckplex device and
   its **Top movie (30 days)** and **Top TV show (30 days)** sensors. Initial
   history loading runs in the background, so they may briefly be unavailable.
   Home Assistant chooses the entity IDs; use the actual IDs shown there.
5. Check Developer tools > States for their title and attributes. Compare
   `since` and `last_updated` with the expected 30-day interval. Display the
   sensors in a standard Entities or Tile card, or use `top_five` in a template.

HACS updates may overwrite these local changes. Retain the ZIP/patch and rebase
or reinstall it after an upstream update. To roll back, restore the backed-up
integration folder and restart Home Assistant. Do not remove/re-add your existing
integration just to install this enhancement.

## Meaning of the sensors

- Source server only: Reckplex, `edf9a1e3-7fe4-4a5e-9fae-521201563900`.
- Movie rankings count `media_type=movie`, grouped by `media_id`. A missing ID
  falls back to case-insensitive title plus year, to separate remakes.
- TV rankings count `media_type=episode`, grouped by `show_media_id`. A missing
  show ID falls back to case-insensitive `show_title`. Counts are **episode plays**,
  not distinct episodes, viewers, or completed seasons.
- Only JSON boolean `watched=true` qualifies. Distinct plays of the same title
  count separately; duplicated history records with the same `id` count once.
- A qualifying play's `started_at` must fall within the inclusive interval from
  exactly 30 days before the refresh's UTC start time through that start time.
  This uses start time, not completion time. Future, invalid and timezone-less
  timestamps are excluded. Timestamp offsets are supported.
- Refresh occurs at startup and every six hours while the sensors are enabled.
  A manual entity update requests another refresh. Between refreshes the title
  and window remain as of `last_updated`; it is not a continuously moving window.
- Ties sort by title, media ID and year. A successful empty history produces an
  unknown title, count 0 and an empty top five. Errors produce unavailable sensors.

State: the winning title (limited to HA's 255-character state limit; full title
is retained in `top_five`). Attributes:

| Attribute | Meaning |
|---|---|
| `count` | Number of qualifying plays for the winner |
| `year` | Movie year; show year only when Tracearr supplies `show_year` |
| `artwork` | Temporary Home Assistant image URL for the winner, or null |
| `top_five` | Up to five objects with title, count, year, media_id and artwork |
| `server_id` | Fixed Reckplex source ID |
| `window_days` | 30 |
| `since` | Exact lower UTC time boundary |
| `last_updated` | Upper UTC boundary / start of last successful refresh |

The sample API exposes episode `year`, which may not be the show's premiere
year. The integration deliberately reports null unless a true `show_year` exists.
Show artwork prefers `show_poster_url`, otherwise uses the history `poster_url`,
which may be an episode image if that is all Tracearr supplies.

## Pagination, errors and images

The request is GET `/api/v2/public/history` with `server_id`, date-only `since`,
`watched=true`, `page_size=100` and subsequent opaque `cursor` values. The
implementation follows `meta.nextCursor` until it is null/empty, even when pages
contain only 25 records or no records. It does not assume the API's date filter
works: every row is checked locally against the exact UTC cutoff, server and
watched flag. All pages are consumed; it does not assume ordering or stop just
because one page contains older plays.

Repeated cursor cycles, a 1,000-page cap, individual 15-second HTTP timeouts and
a five-minute whole-refresh deadline prevent unbounded work. Incomplete or
malformed responses never publish partial rankings. A failed refresh retains the
previous cache internally but marks both history sensors unavailable; the next
successful refresh recovers automatically. HTTP 401/403 produces a sanitized
authentication error; 429 and server/network errors similarly fail the refresh.
The normal six-hour interval applies after failure; this adds no tight retry loop
or automatic reauthentication flow. Live sensors continue independently.

Artwork goes through the existing authenticated HA image proxy. Only cached
ranking images can be requested, and the proxy fetches only Tracearr's own
`/api/v1/images/proxy` endpoint. API Authorization stays server-side. The frontend
receives a temporary, path-specific Home Assistant signature valid for seven
hours, not the Tracearr key. Do not treat that temporary image URL as a permanent
share link. External artwork URLs or unsupported image types are rejected by the
proxy; missing/broken artwork does not invalidate the ranking.

## English UI

Select English in your Home Assistant user profile for the existing English
configuration/options screens and the new English sensor names. French sensor
translations are included too. The bundled Lovelace cards contain hard-coded
French text in upstream v0.1.16; this enhancement preserves their JavaScript and
does **not** provide a complete English card/editor translation. Standard Home
Assistant cards can display the new sensors in English immediately.

## Validation and limits

The supplied tests use synthetic history and real local aiohttp HTTP requests.
They cover 25-record pages despite a 100-record request, opaque cursor encoding,
empty pages, repeated/cyclic cursors, page caps, exact UTC boundaries and offsets,
ignored API filters, movie/show grouping and fallbacks, duplicated play IDs,
top-five ranking, auth/rate-limit/server failures, timeouts, malformed responses,
cache preservation/recovery, sensor attributes, background startup cancellation,
and protected history artwork. Existing Python and card regressions are included.

Home Assistant coordinator/entity interfaces are test doubles following this
repository's existing test style. These are not a full Home Assistant runtime
test. No private Tracearr key was requested or used, and no live counts or
installed HA instance were verified. The provided API sample and pagination
output guided the contract; confirm the two sensor values after installation.

For maintainers, from the extracted source root:

```sh
python -m pip install pytest aiohttp
python -m pytest -q tests
python -m compileall -q custom_components tests
node --check custom_components/tracearr_ha/frontend/tracearr-card.js
node --test tests/test_carousel.cjs
```

The accompanying patch applies to clean upstream v0.1.16 with `git apply`.
No PR was published and no deployment was performed.
