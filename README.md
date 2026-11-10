# Tracearr HA

English · [Français — original reference guide](README.fr.md)

[![Validation](https://github.com/kgarz/home-assistant-tracearr/actions/workflows/validate.yml/badge.svg)](https://github.com/kgarz/home-assistant-tracearr/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Monitor Plex, Jellyfin, and Emby playback in Home Assistant using Tracearr.**
This integration provides live playback sensors, server status, and two
customizable dashboard cards for multiple streams or a single stream.

This is **kgarz's modified fork** of
[Moosketair/home-assistant-tracearr](https://github.com/Moosketair/home-assistant-tracearr),
based on upstream **v0.1.16**. Credit for the original integration belongs to
Moosketair and contributors. The fork adds Reckplex history sensors,
English/French dashboard cards, and a fix for incomplete poster downloads.
The integration manifest remains `0.1.16`; Marketplace may identify fork updates
by their commit instead. This fork is added as a custom repository, not as a
separate official catalog release.

## Features

- **Live playback:** real-time SSE updates with REST polling as a fallback.
- **Playback sensors:** active, playing, and paused streams; direct playback;
  audio/video transcodes; estimated bandwidth; and server availability.
- **Two dashboard cards:** `custom:tracearr-streams-card` for a list or carousel,
  and `custom:tracearr-stream-card` for one stream.
- **English and French UI:** translated card editors, labels, help text, and
  navigation, with automatic language selection or a per-card override.
- **Reckplex history:** top movie and top TV show over the rolling 30 days,
  counting watched plays and refreshing every six hours.
- **Customizable playback display:** posters, avatars, titles, episodes,
  progress, remaining time, estimated end time, badges, server colors, and
  compact mode.
- **Carousel controls:** optional autoplay, transitions, arrows, and touch,
  keyboard, or mouse navigation.
- **Local/remote bandwidth:** manually classify users or devices and filter
  the displayed bandwidth.
- **Native dashboard layout:** Home Assistant's Sections layout controls the
  card size.

## Install this fork

### Home Assistant 2026.11 and later: Marketplace

1. Back up Home Assistant before replacing an existing installation.
2. Open **Settings → Marketplace** and select **Add from link**.
3. Enter `https://github.com/kgarz/home-assistant-tracearr` and select
   **Integration** if a content type is requested.
4. Install the latest version from this fork's **main** branch. An inherited
   upstream tag such as `v0.1.16` does not contain these enhancements.
5. Complete the Tracearr setup when prompted, or open
   **Settings → Devices & services → Add integration → Tracearr HA**.
6. Enter your Tracearr URL and public API key (`trr_pub_...`). Obtain the key
   from Tracearr's **Settings → Data & API → API** page.
7. Restart Home Assistant if prompted. For updates to an already loaded
   integration, restart Home Assistant to load the new code.
8. Edit your dashboard, choose **Add card**, and search for **Tracearr**.

**Already using the original repository?** Marketplace prevents two repositories
from owning the same `custom_components/tracearr_ha` folder. Adding this fork
alone does not switch the installed source. Uninstalling the original through
**Delete and uninstall** also removes its configured integration entries,
devices, and entities. Have a backup, your Tracearr URL/API key, and any custom
settings ready before choosing that route; then install and configure this fork.
Entity IDs and dashboard references may need checking afterward. A manual file
replacement can preserve the existing setup, but does not transfer Marketplace
ownership or update tracking.

**Updating this fork:** open its Marketplace entry and choose
**Refresh information**. Install the offered update, or use **Reinstall** to fetch
the latest default branch if no update is offered. Restart Home Assistant, then
refresh the dashboard browser with **Ctrl+F5** or reload the companion app.

### Older Home Assistant versions: HACS

Add `https://github.com/kgarz/home-assistant-tracearr` as a custom repository with
category **Integration**, download this fork's default branch, and restart Home
Assistant. Add Tracearr HA under **Settings → Devices & services** and configure
its URL and public API key. The same folder-ownership caution applies when
replacing another repository.

### Manual installation

Copy this repository's entire `custom_components/tracearr_ha` folder into your
Home Assistant configuration folder's `custom_components` directory. Back up any
existing folder first. Restart Home Assistant afterward. See the
[language and installation guide](docs/dashboard-language.md) and
[Reckplex sensor guide](docs/reckplex-history.md) for more detail.

## Choose your card language

Open a card's visual editor and select **General display → Language → English**.
In French, the setting is **Affichage général → Langue → English**.

The default, **Automatic**, follows Home Assistant's language when available,
then the browser language. French regional settings use French; unsupported
languages fall back to English. Both card types accept the same YAML setting:

```yaml
language: en
```

Use `language: fr` for French or `language: auto` for automatic selection.
Your custom titles, badge labels, messages, media names, and aliases are preserved.
If an old card explicitly saves the French default empty message, remove its
`empty_message` setting or set it to null to use the translated default.

## Quick examples

### Multiple streams with a blurred poster background and badges

```yaml
type: custom:tracearr-streams-card
language: en
mode: list
stream_surface: blur
stream_blur: 26
stream_overlay: 72
stream_accent_style: rounded
show_header: true
header_show_streams: true
header_show_transcodes_total: true
header_metric_settings:
  streams:
    align: left
  transcodes_total:
    align: right
```

### A single stream: most recent active session

```yaml
type: custom:tracearr-stream-card
language: en
selection: recent
show_poster: true
poster_size: 110
show_end_time: true
```

Use the visual editor to select users or servers without typing their IDs.
Existing card options remain compatible.

## Reckplex: top movie and TV show

The two history sensors are **Top movie (30 days)** and **Top TV show (30 days)**,
on the Reckplex device. Home Assistant chooses their entity IDs, so check
**Developer tools → States** for the IDs in your installation.

- Only `watched=true` plays from Reckplex are counted.
- Movies group by `media_id`; TV episode plays group by `show_media_id`, with
  title fallbacks when IDs are unavailable.
- The window uses the play's start time and is exactly 30 days at each refresh.
- Sensors refresh at startup and every six hours. Their states are the winning
  titles, with count, year, artwork, and top-five attributes.
- History requests follow cursor pagination, even when Tracearr returns only
  25 rows per page, and validate date/server filters locally.
- Failed or incomplete refreshes mark history sensors unavailable without
  publishing partial rankings or interrupting live playback sensors.

These sensors currently use the fixed Reckplex server ID
`edf9a1e3-7fe4-4a5e-9fae-521201563900`; other servers require a code change.
TV counts represent episode plays, not distinct episodes or viewers.
See the [full history sensor guide](docs/reckplex-history.md) for attributes,
edge cases, and troubleshooting.

## Dashboard resources

Storage-managed dashboards register the bundled card resource automatically.
If you manage resources in YAML, add it once as a JavaScript module:

```yaml
url: /tracearr_ha/tracearr-card.js?v=0.1.16-i18n1
type: module
```

Avoid duplicate resource entries. After updating, restart Home Assistant and
refresh the browser cache if the card or editor still shows an older version.

## Recent upstream improvements

The fork retains upstream v0.1.16's compact, centered header badges and recent
improvements to mobile layouts, blurred poster backgrounds, rounded accent
borders, poster sizing, and individual badge styling. For upstream release
history, see the [changelog](CHANGELOG.md) (French).

## Documentation

- [English/French cards and installation](docs/dashboard-language.md)
- [Reckplex rolling 30-day history sensors](docs/reckplex-history.md)
- [Complete card configuration reference](docs/CONFIGURATION.md) (French)
- [Upstream changelog](CHANGELOG.md) (French)
- [Maintenance, publishing, and branding notes](docs/MAINTENANCE.md) (French)

## Compatibility and limits

- The declared minimum is Home Assistant **2025.6**. Marketplace installation
  instructions apply to **2026.11 and later**.
- Tracearr must provide **Public API v2**. Upstream documents SSE support from
  Tracearr 2.7.0; REST polling provides the fallback.
- Use a current Chromium, Firefox, or Safari browser.
- Local/remote playback classification requires manual mappings; it is not
  detected automatically by this integration.
- Remotely stopping playback is not implemented.
- Displayed information depends on what Tracearr provides and may be incomplete
  or delayed.

## Troubleshooting

- **No sensors:** check the Tracearr URL, API key, and Home Assistant logs.
- **Old or missing cards:** check the dashboard resource, restart Home Assistant,
  and refresh the browser cache.
- **Missing posters:** confirm Tracearr supplies `poster_url`. The fork's proxy
  reads the complete image response, including slowly streamed downloads, while
  retaining the image-size limit. Missing artwork leaves a plain background.
- **Carousel not moving:** check visible-stream count, autoplay, reduced-motion
  preferences, and pause-on-hover settings.
- **History sensors unavailable:** inspect the sanitized history error in the
  logs. Authentication, network errors, malformed pages, or pagination safety
  limits can prevent a complete ranking.

## License and credits

[MIT License](LICENSE). Copyright © 2026 Moosketair and contributors.
Original project by [Moosketair](https://github.com/Moosketair/home-assistant-tracearr);
this fork maintains its license and attribution.

Independent community project, with no official affiliation or endorsement from
Tracearr, Home Assistant, Plex, Jellyfin, or Emby. The upstream icon is an original,
separate design.
