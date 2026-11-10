# English and French dashboard cards

Both `custom:tracearr-streams-card` (list/carousel) and
`custom:tracearr-stream-card` (single playback) now support English and French,
including their visual editors, help text, status labels, navigation labels,
season/episode wording and card-picker descriptions.

## Select English

Open a card's visual editor, expand **General display**, and choose
**Language > English**. In French this is **Affichage général > Langue > English**.
The same setting is available in YAML:

```yaml
type: custom:tracearr-streams-card
language: en
```

Keep the rest of your existing card settings. The single-stream card uses the
same `language` option. Values are `auto` (default), `en`, and `fr`.

Automatic uses your Home Assistant language when available, otherwise the browser
language. Regional French, such as `fr-CA`, uses French; other unsupported
languages use English. Switching your HA profile language updates automatic cards
and editors without changing their saved configuration. Card-picker names use
the browser language initially and HA's language once a card or editor receives
HA state.

Custom titles, empty-playback messages, badge labels, user aliases, media titles
and server names are never translated. If an old card explicitly saved
`empty_message: Aucune lecture en cours`, remove that line or set it to null for
the translated default. You can also edit it to your own English message.

## Install this fork's changes

Back up your current `/config/custom_components/tracearr_ha` folder outside
`custom_components`, then replace it with this fork's complete
`custom_components/tracearr_ha` folder and restart Home Assistant. Your existing
integration entry, API key and card YAML can remain in place.

For dashboards managed in storage mode, the integration updates the existing
card resource automatically to:

```
/tracearr_ha/tracearr-card.js?v=0.1.16-i18n1
```

If your Lovelace resources are managed in YAML, update that existing resource's
URL manually and keep `type: module`. Avoid duplicate resource entries. Refresh
the browser with Ctrl+F5 (or reload the companion app) after restarting HA.

The integration manifest remains 0.1.16; the resource suffix only invalidates the
browser's cached card code. This is a local fork enhancement, not an official
upstream release. HACS updates from the original repository can overwrite it.

## Validation

The original French card regression suite is retained, with dedicated tests for
English rendering in both cards and editors, regional/automatic language choice,
explicit overrides, live language changes, custom data/HTML escaping, and stream
count singular/plural labels. Backend history tests remain included. These tests
use lightweight HA/browser doubles, not a running Home Assistant deployment.

Run from the source root:

```sh
node --check custom_components/tracearr_ha/frontend/tracearr-card.js
node --test tests/test_carousel.cjs tests/test_card_i18n.cjs
python -m pytest -q tests
```
