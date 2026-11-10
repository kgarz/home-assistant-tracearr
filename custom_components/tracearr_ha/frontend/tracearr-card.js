/* Tracearr HA Lovelace cards 0.1.16 - no external frontend dependencies. */
(() => {
  "use strict";
  if (customElements.get("tracearr-streams-card")) return;

  // Translate only built-in UI strings; never media names or custom labels.
  const ENGLISH = Object.freeze({
    "Aucune lecture en cours": "Nothing playing",
    "Titre du film": "Movie title",
    "Titre de la série": "Show title",
    "Saison": "Season",
    "Épisode": "Episode",
    "Numéro d’épisode": "Episode number",
    "Nom de l’épisode": "Episode title",
    "Année": "Year",
    "État du serveur": "Server status",
    "Nom du serveur": "Server name",
    "Appareil / lecteur": "Device / player",
    "Résolution": "Resolution",
    "Débit du flux": "Stream bitrate",
    "Codecs": "Codecs",
    "Nombre de flux": "Stream count",
    "Débit total": "Total bandwidth",
    "Lectures directes": "Direct plays",
    "Lectures en pause": "Paused streams",
    "Transcode vidéo seul": "Video-only transcodes",
    "Transcode audio seul": "Audio-only transcodes",
    "Transcode vidéo + audio": "Video and audio transcodes",
    "Total des transcodages": "Total transcodes",
    "Flux par serveur": "Streams per server",
    "Inconnu": "Unknown",
    "Affiche": "Poster",
    "Serveur": "Server",
    "Débit local": "Local bandwidth",
    "Débit distant": "Remote bandwidth",
    "Débit": "Bandwidth",
    "Direct": "Direct",
    "Pause": "Paused",
    "Vidéo": "Video",
    "Audio": "Audio",
    "Vidéo + audio": "Video + audio",
    "Transcodes": "Transcodes",
    "Indisponible": "Unavailable",
    "Lectures en cours": "Now playing",
    "Transcodage": "Transcoding",
    "Lecture directe": "Direct play",
    "Tracearr indisponible": "Tracearr unavailable",
    "Sans nom": "Unnamed",
    "Nouveau badge": "New badge",
    "Instance Tracearr": "Tracearr instance",
    "Automatique (première instance)": "Automatic (first instance)",
    "Quelle lecture afficher ?": "Which stream should be shown?",
    "Dernière lecture active": "Most recent active stream",
    "Lecture d'un utilisateur": "Stream from a user",
    "Lecture d'un serveur": "Stream from a server",
    "Session en cours précise": "Specific active session",
    "Utilisateur (continue sur ses prochains films)": "User (follows their next titles)",
    "Choisir un utilisateur": "Choose a user",
    "Utilisateur précédemment choisi": "Previously selected user",
    "Choisir un serveur": "Choose a server",
    "Serveur précédemment choisi": "Previously selected server",
    "Session active (disparaît quand elle se termine)": "Active session (disappears when it ends)",
    "Choisir une lecture": "Choose a stream",
    "Session précédemment choisie (terminée)": "Previously selected session (ended)",
    "Filtrer par serveur": "Filter by server",
    "Tous les serveurs": "All servers",
    "Filtrer par utilisateur": "Filter by user",
    "Tous les utilisateurs": "All users",
    "Mode de lecture": "Playback mode",
    "Tous": "All",
    "Vidéo seule": "Video only",
    "Audio seul": "Audio only",
    "Vidéo et audio": "Video and audio",
    "Ordre des flux": "Stream order",
    "Plus récent d'abord": "Most recent first",
    "Utilisateur": "User",
    "Afficher les noms des statistiques": "Show statistic names",
    "Masquer les badges à zéro": "Hide badges at zero",
    "Clignoter si la valeur est positive": "Blink when positive",
    "Période de clignotement (secondes)": "Blink interval (seconds)",
    "Couleur des badges": "Badge color",
    "Palette globale": "Global palette",
    "Thème Home Assistant": "Home Assistant theme",
    "Couleur du serveur": "Server color",
    "Personnalisée": "Custom",
    "Couleur à zéro": "Color at zero",
    "Palette normale": "Normal palette",
    "Afficher l'en-tête": "Show header",
    "Afficher le titre": "Show title",
    "Statistiques Tracearr": "Tracearr statistics",
    "Badges d'entités Home Assistant": "Home Assistant entity badges",
    "Style et comportement communs aux badges": "Shared badge style and behavior",
    "Ordre des badges": "Badge order",
    "Défilement automatique": "Automatic scrolling",
    "Flèches de navigation": "Navigation arrows",
    "Glissement à la souris": "Drag with mouse",
    "Pause au survol": "Pause on hover",
    "Nombre de flux visibles": "Visible stream count",
    "Intervalle (secondes)": "Interval (seconds)",
    "Transition": "Transition",
    "Glissement": "Slide",
    "Fondu": "Fade",
    "Zoom": "Zoom",
    "Retournement 3D": "3D flip",
    "Sans animation": "No animation",
    "Durée de transition (ms)": "Transition duration (ms)",
    "Afficher l'année": "Show year",
    "Nom de l'épisode": "Episode title",
    "Afficher la saison": "Show season",
    "Afficher le numéro d'épisode": "Show episode number",
    "Année de la série": "Show year",
    "Format de saison et épisode": "Season and episode format",
    "Saison 1 · Épisode 2": "Season 1 · Episode 2",
    "Débits à afficher (sur les flux et dans l'en-tête)": "Bitrates to show (streams and header)",
    "Tous les débits": "All bitrates",
    "Flux locaux uniquement": "Local streams only",
    "Flux distants uniquement": "Remote streams only",
    "Disposition": "Layout",
    "Liste verticale": "Vertical list",
    "Carrousel": "Carousel",
    "Mode compact": "Compact mode",
    "Inclure les lectures en pause": "Include paused streams",
    "Avatar": "Avatar",
    "Progression": "Progress",
    "Temps restant et pause": "Remaining time and pause status",
    "Fin de lecture estimée": "Estimated end time",
    "Icônes vidéo/audio": "Video/audio icons",
    "Fond intérieur des lectures": "Stream background",
    "Légèrement contrasté": "Soft contrast",
    "Transparent": "Transparent",
    "Affiche floutée (cinéma)": "Blurred poster (cinema)",
    "Intensité du flou": "Blur intensity",
    "Assombrissement du fond": "Background dimming",
    "Style du liseré gauche": "Left accent style",
    "Arrondi (suit les coins)": "Rounded (follows corners)",
    "Trait droit (ancien style)": "Straight line (legacy)",
    "Masqué": "Hidden",
    "Épaisseur du liseré": "Accent width",
    "Taille du texte (px)": "Text size (px)",
    "Taille de l'affiche (%)": "Poster size (%)",
    "En l'absence de lecture": "When nothing is playing",
    "Message personnalisé": "Custom message",
    "En-tête uniquement": "Header only",
    "Masquer la carte": "Hide card",
    "Palette globale des couleurs": "Global color palette",
    "Couleur de Plex / Jellyfin / Emby": "Plex / Jellyfin / Emby color",
    "Affichage général": "General display",
    "Choix des lectures et filtres": "Stream selection and filters",
    "Navigation et carrousel": "Navigation and carousel",
    "En-tête et badges": "Header and badges",
    "Titres, saisons et années": "Titles, seasons and years",
    "Bandeau d'informations du flux": "Stream information footer",
    "Débit local / distant": "Local / remote bandwidth",
    "Réglages avancés par carte": "Advanced card settings",
    "Tracearr – Lectures en cours": "Tracearr – Now playing",
    "Liste ou carrousel des flux Plex, Jellyfin et Emby": "List or carousel of Plex, Jellyfin and Emby streams",
    "Tracearr – Lecture individuelle": "Tracearr – Single stream",
    "Un seul flux Tracearr, à afficher séparément": "One Tracearr stream displayed separately",
    "Fin à": "Ends at",
    "Serveur hors ligne": "Server offline",
    "État du flux audio et vidéo": "Audio and video stream status",
    "Lecture en pause": "Playback paused",
    "En pause": "Paused",
    "Lectures en carrousel": "Stream carousel",
    "Précédent": "Previous",
    "Suivant": "Next",
    "Alignement": "Alignment",
    "Automatique (selon le titre)": "Automatic (based on title)",
    "Gauche": "Left",
    "Centre": "Center",
    "Droite": "Right",
    "Ouvrez une statistique pour régler son alignement et son apparence individuellement. Les options non modifiées suivent le style global.": "Open a statistic to adjust its alignment and appearance. Unchanged options follow the global style.",
    "Nom personnalisé (facultatif)": "Custom name (optional)",
    "Afficher le nom": "Show name",
    "Afficher l'icône": "Show icon",
    "Afficher si supérieur à 0": "Show when greater than 0",
    "Clignoter si supérieur à 0": "Blink when greater than 0",
    "Icône MDI (facultatif)": "MDI icon (optional)",
    "Durée d'un clignotement (secondes)": "Blink duration (seconds)",
    "Couleur si valeur à zéro": "Color when value is zero",
    "Réglage global": "Global setting",
    "Couleur particulière": "Custom color",
    "Couleur personnalisée à zéro": "Custom color at zero",
    "Ajoutez une entité, puis ouvrez sa fiche pour modifier ses options.": "Add an entity, then open its section to edit its options.",
    "Entité": "Entity",
    "Choisir une entité": "Choose an entity",
    "Nom facultatif": "Optional name",
    "Nom de l'entité": "Entity name",
    "Icône de l'entité": "Entity icon",
    "Supprimer": "Remove",
    "Supprimer le badge": "Remove badge",
    "+ Ajouter un badge": "+ Add badge",
    "Choisis une cible ci-dessus ; seuls les champs du mode sélectionné sont utilisés. Pour une carte permanente, privilégie un utilisateur plutôt qu'un ID de session temporaire.": "Choose a target above; only fields for the selected mode are used. For a permanent card, choose a user rather than a temporary session ID.",
    "Couleur personnalisée": "Custom color",
    "Titre": "Title",
    "Barre horizontale masquée. Navigation tactile toujours disponible.": "Horizontal scrollbar hidden. Touch navigation remains available.",
    "Films": "Movies",
    "Ordre d'affichage (flèches pour déplacer les champs, même masqués) :": "Display order (use arrows to move fields, including hidden fields):",
    "Séries et épisodes": "Shows and episodes",
    "Ordre d'affichage de toutes les informations :": "Display order for all information:",
    "Les réglages d'année sont indépendants entre films et séries.": "Year settings are independent for movies and shows.",
    "Ordre des informations du bandeau (champs masqués inclus) :": "Footer information order (including hidden fields):",
    "Les badges de résolution et de débit adoptent la palette globale avec une écriture blanche ou noire automatique.": "Resolution and bitrate badges use the global palette with automatic white or black text.",
    "Exceptions pour cette carte (facultatif, priorité sur les réglages de l’intégration)": "Overrides for this card (optional; take priority over integration settings)",
    "Les affectations globales se configurent dans Paramètres → Appareils et services → Tracearr HA → Configurer → Localisation des appareils. Ici, vous pouvez ajouter des exceptions : serveur:utilisateur=local/remote, device:Nom=local/remote, player:Nom=local/remote ou utilisateur=local/remote. Les flux sans correspondance restent inconnus et ne sont pas comptés en mode local/distant.": "Configure global assignments in Settings → Devices & services → Tracearr HA → Configure → Device locations. Add overrides here: server:user=local/remote, device:Name=local/remote, player:Name=local/remote or user=local/remote. Unmatched streams remain unknown and are excluded from local/remote totals.",
    "Le fond cinéma utilise l'affiche du média et reste sombre pour préserver la lisibilité. Sans affiche, le fond reste uni.": "The cinema background uses the media poster and stays dark for readability. Without a poster, the background stays solid.",
    "100 % correspond à la taille actuelle. Le réglage s'applique aussi au mode compact.": "100% is the current size. This setting also applies in compact mode.",
    "Message sans lecture": "Empty playback message",
    "Couleur globale personnalisée": "Custom global color",
    "La hauteur et la largeur se règlent uniquement dans l'onglet Mise en page de Home Assistant. Les couleurs propres aux badges restent prioritaires sur la palette globale.": "Adjust height and width in Home Assistant's Layout tab. Individual badge colors take priority over the global palette.",
    "Alias propres à cette carte": "Display names for this card",
    "Avatars propres à cette carte (URLs HTTPS)": "Avatars for this card (HTTPS URLs)",
    "Pour modifier tous les utilisateurs, utilisez la liste dans Paramètres → Appareils et services → Tracearr HA → Configurer.": "To edit all users, use the list in Settings → Devices & services → Tracearr HA → Configure.",
    "Monter": "Move up",
    "Descendre": "Move down",
    "Langue": "Language",
    "Automatique (Home Assistant)": "Automatic (Home Assistant)"
  });
  const browserLanguage = () => typeof navigator !== "undefined" ? navigator.language : "en";
  const languageFor = (config, hass) => {
    const chosen = ["en", "fr"].includes(config?.language) ? config.language :
      hass?.language || hass?.locale?.language || browserLanguage();
    return String(chosen || "en").toLowerCase().split(/[-_]/)[0] === "fr" ? "fr" : "en";
  };
  const translate = (language, text) => String(language).toLowerCase().split(/[-_]/)[0] === "fr" ? text : (ENGLISH[text] ?? text);

  const DEFAULTS = {
    language: "auto",
    mode: "list", carousel_visible: 1, carousel_autoplay: false,
    carousel_interval: 7, carousel_transition: "slide", carousel_transition_speed: 600,
    carousel_hide_scrollbar: true, carousel_show_arrows: true, carousel_mouse_drag: true,
    carousel_pause_on_hover: false, compact: false, show_title: true, show_counter: true,
    show_transcodes: false, show_transcode_icons: true, show_poster: true, poster_size: 100, show_avatar: true,
    show_progress: true, show_end_time: false, show_quality: true, show_device: true, show_server: true,
    show_bitrate: false, show_health: true, show_codecs: false, show_year: true, show_remaining: true,
    show_paused: true, hide_empty: false, empty_mode: "message", empty_message: null,
    sort: "recent", filter_transcode: "all",
    show_header: true, header_show_streams: true, header_show_bandwidth: false,
    header_show_direct: false, header_show_paused: false,
    header_show_video: false, header_show_audio: false, header_show_both: false,
    header_show_transcodes_total: false, header_show_server_counts: false,
    header_entity_badges: [], header_metric_settings: {},
    header_badge_order: "streams,bandwidth,direct,paused,video,audio,both,transcodes_total,server_counts",
    header_positive_only: false, header_blink_positive: false,
    header_blink_seconds: 2, header_show_names: true,
    header_zero_color_mode: "normal", header_zero_custom_color: "#576574",
    stream_surface: "soft", stream_blur: 26, stream_overlay: 72,
    stream_accent_style: "rounded", stream_accent_width: 4,
    selection: "recent",
    font_size: 14, accent_color_mode: "theme", accent_custom_color: "#00BCD4",
    // Independent movie / TV fields, with a rearrangeable visual order.
    movie_show_title: true, movie_show_year: true, movie_field_order: "title,year",
    series_show_title: true, series_show_episode_title: true,
    series_show_season_episode: true, series_show_season: true, series_show_episode_number: true,
    series_show_year: true,
    series_episode_style: "short", series_field_order: "series,season,episode_number,episode,year",
    bitrate_scope: "both", network_locations: "",
    footer_field_order: "health,server,device,quality,bitrate,codecs",
    // Header metric pills may have a separate palette from stream badges.
    header_badge_color_mode: "inherit", header_badge_custom_color: "#00BCD4",
    aliases: "", avatars: "",
  };
  const E = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);
  const fmtTime = (ms) => {
    if (!Number.isFinite(ms) || ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    return s >= 3600 ? `${Math.floor(s / 3600)}:${String(Math.floor(s % 3600 / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` :
      `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  // Calculate the displayed seconds as a *pair*, never by independently
  // rounding elapsed and remaining milliseconds. This guarantees that both
  // clocks change on the same tick and add up to the displayed duration.
  const playbackSeconds = (progressMs, durationMs) => {
    const duration = Math.max(0, Number(durationMs) || 0);
    const progress = Math.max(0, Math.min(duration || Infinity, Number(progressMs) || 0));
    const total = Math.ceil(duration / 1000);
    const elapsed = Math.min(total, Math.floor(progress / 1000));
    return {elapsed, remaining: Math.max(0, total - elapsed), total};
  };
  const formattedSeconds = seconds => fmtTime(seconds * 1000);
  const timeOfDay = (epochMs, language) => new Intl.DateTimeFormat(language, {
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(epochMs));
  const estimatedEnd = (clock, now, wallNow, language) => clock && clock.state === "playing" && clock.duration > 0
    ? timeOfDay(wallNow + Math.max(0, clock.duration - Math.min(clock.duration, now)), language) : "";
  const transcodeMode = (s) => {
    if (s.video_decision === "transcode" && s.audio_decision === "transcode") return "both";
    if (s.video_decision === "transcode") return "video";
    if (s.audio_decision === "transcode") return "audio";
    if (s.is_transcode) return "unknown";
    if (["copy", "directplay"].includes(s.video_decision) || ["copy", "directplay"].includes(s.audio_decision)) return "direct";
    return "unknown";
  };
  const MOVIE_FIELDS = Object.freeze(["title", "year"]);
  const SERIES_FIELDS = Object.freeze(["series", "season", "episode_number", "episode", "year"]);
  const MEDIA_LABELS = Object.freeze({
    title: "Titre du film", series: "Titre de la série", season: "Saison",
    episode_number: "Numéro d’épisode", episode: "Nom de l’épisode", year: "Année",
  });
  const FOOTER_FIELDS = Object.freeze(["health", "server", "device", "quality", "bitrate", "codecs"]);
  const FOOTER_LABELS = Object.freeze({
    health:"État du serveur",server:"Nom du serveur",device:"Appareil / lecteur",
    quality:"Résolution",bitrate:"Débit du flux",codecs:"Codecs",
  });
  const HEADER_FIELDS = Object.freeze(["streams", "bandwidth", "direct", "paused", "video", "audio", "both", "transcodes_total", "server_counts"]);
  const HEADER_LABELS = Object.freeze({
    streams:"Nombre de flux",bandwidth:"Débit total",direct:"Lectures directes",
    paused:"Lectures en pause",video:"Transcode vidéo seul",audio:"Transcode audio seul",
    both:"Transcode vidéo + audio",transcodes_total:"Total des transcodages",server_counts:"Flux par serveur",
  });
  const HEADER_ICONS = Object.freeze({
    streams:"mdi:play-circle-outline",bandwidth:"mdi:speedometer",direct:"mdi:check-circle-outline",
    paused:"mdi:pause-circle-outline",video:"mdi:filmstrip",audio:"mdi:music-note",
    both:"mdi:movie-music",transcodes_total:"mdi:swap-horizontal",server_counts:"mdi:server",
  });
  const badgeAlign = value => ["left","center","right"].includes(value) ? value : "auto";
  function normalizedOrder(order, allowed) {
    const values = String(order || "").split(",").map(v => v.trim());
    return [...new Set([...values.filter(v => allowed.includes(v)), ...allowed])];
  }
  const SERVER_ACCENTS = Object.freeze({ plex: "#E5A00D", jellyfin: "#AA5CC3", emby: "#52B54B" });
  const TRANSITION_EFFECTS = ["slide", "fade", "zoom", "flip", "none"];
  const clamp = (value, min, max, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  };
  const codecState = (decision) => decision === "transcode" ? "transcode" :
    ["directplay", "copy"].includes(decision) ? "direct" : "unknown";
  // Original inline pictograms: a movie clapperboard/play button and a
  // speaker with sound waves, using simple geometric paths (no Flaticon assets).
  const badgeIcon = (kind) => kind === "video" ?
    `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.8" y="8.5" width="18.4" height="12.3" rx="1.8"/><path d="M3.8 8.5 2.6 5.9a1.5 1.5 0 0 1 1-2L18.9 1.7a1.4 1.4 0 0 1 1.6 1.1l.4 2.3-17.1 3.4ZM8.3 3.2l3.1 4.1m2.2-4.8 3.2 4.1"/><path d="m9.5 11.8 5.7 3-5.7 3.1v-6.1Z" fill="currentColor" stroke="none"/></svg>` :
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4.2L12.8 4v16l-5.6-5H3V9Z"/><path d="M16.1 8.1c1.9 2 1.9 5.8 0 7.8m2.7-10.7c3.3 3.7 3.3 10 0 13.7"/></svg>`;
  const validColor = (value) => /^#[0-9a-fA-F]{6}$/.test(String(value || "")) ? value : "#00BCD4";
  // Centralized palette: progress, metric pills and per-stream badges share the
  // same choice. Contrast uses WCAG relative luminance (black or white).
  const readRgb = (value) => {
    const raw = String(value || "").trim();
    const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      const v = hex[1].length === 3 ? [...hex[1]].map(x => x + x).join("") : hex[1];
      return [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16));
    }
    const rgb = raw.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]+(\d+(?:\.\d+)?)\s*[,\s]+(\d+(?:\.\d+)?)/i);
    return rgb ? rgb.slice(1, 4).map(v => clamp(v, 0, 255, 0)) : null;
  };
  const contrastColor = (background) => {
    const rgb = readRgb(background) || [0, 188, 212];
    const linear = rgb.map(n => { const v = n / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    return luminance > 0.179 ? "#000000" : "#FFFFFF";
  };
  const asMapping = (input) => {
    if (input && typeof input === "object") return input;
    const result = {};
    for (const line of String(input || "").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at > 0 && line.slice(at + 1).trim()) result[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
    return result;
  };
  const safeImage = (url) => {
    if (!url || typeof url !== "string") return "";
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol) ? url : "";
    } catch { return ""; }
  };
  const style = `
    :host { display:block; width:100%; height:100%; min-width:0; box-sizing:border-box;
      color:var(--primary-text-color,#fff); container-type:inline-size; --tr-font-size:14px; }
    /* Home Assistant owns the real card surface, radius, border and shadow. */
    ha-card { border-radius:var(--ha-card-border-radius,16px); overflow:hidden;
      color:var(--primary-text-color,#fff); height:100%; min-height:0; box-sizing:border-box; }
    .root { padding:14px; min-width:0; height:100%; box-sizing:border-box;
      overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; }
    .head { display:flex; flex-wrap:wrap; align-items:center; gap:8px 12px;
      margin:0 0 12px; color:var(--primary-text-color,#fff); }
    .head h3 { flex:0 1 auto; margin:0; font-size:calc(var(--tr-font-size)*1.24); font-weight:700;
      color:var(--primary-text-color,#fff); overflow-wrap:anywhere; }
    /* Only render populated badge groups. Without center badges, the left and
       right groups share a flexible row and no empty middle column is reserved. */
    .head-metrics { display:flex; flex:1 1 320px; width:0; flex-wrap:wrap;
      align-items:center; justify-content:space-between; gap:5px 10px; min-width:0; }
    .head-group { display:flex; flex:0 1 auto; flex-wrap:wrap; align-items:center; gap:5px; min-width:0; }
    .head-group.align-left { justify-content:flex-start; }
    .head-group.align-center { justify-content:center; }
    .head-group.align-right { justify-content:flex-end; margin-left:auto; }
    .head.no-title .head-metrics { width:100%; }
    .head-metrics.only-center { justify-content:center; }
    /* Give the center only its badges' intrinsic width; the two remaining
       tracks share the free space equally, keeping the badge at the true
       midpoint. This keeps all three groups on one line on most phones. */
    .head-metrics.with-center { display:grid;
      grid-template-columns:minmax(0,1fr) max-content minmax(0,1fr); }
    .head-metrics.with-center > .align-left { grid-column:1; }
    .head-metrics.with-center > .align-center { grid-column:2; width:max-content;
      max-width:100%; justify-self:center; justify-content:center; }
    .head-metrics.with-center > .align-right { grid-column:3; margin-left:0; }
    @container (max-width:260px) {
      /* Only extremely narrow card containers need the centered badge(s)
         to occupy another row. Avoid arbitrary mobile-width breakpoints. */
      .head-metrics.with-center { display:flex; }
      .head-metrics.with-center > .align-left { order:1; }
      .head-metrics.with-center > .align-right { order:2; margin-left:auto; }
      .head-metrics.with-center > .align-center { order:3; flex:1 1 100%;
        width:100%; margin-inline:0; justify-content:center; }
    }
    .metric { display:inline-flex; align-items:center; gap:4px; padding:4px 9px; border-radius:20px;
      font-size:calc(var(--tr-font-size)*.80); font-weight:600; background:var(--pill-bg);
      color:var(--pill-text); white-space:nowrap; }
    .metric ha-icon { --mdc-icon-size:16px; width:16px; height:16px; display:inline-flex; }
    .metric.blink-positive { animation:tracearr-badge-pulse var(--badge-blink,2s) ease-in-out infinite; }
    @keyframes tracearr-badge-pulse { 0%,100% { opacity:1; } 50% { opacity:.22; } }
    .streams { display:flex; flex-direction:column; gap:10px; }
    .streams.carousel { overflow-x:auto; flex-direction:row; scroll-snap-type:x mandatory;
      scrollbar-width:none; -ms-overflow-style:none; scroll-behavior:auto; padding-bottom:0;
      overscroll-behavior-x:contain; cursor:grab; touch-action:pan-x pan-y; }
    .streams.carousel::-webkit-scrollbar { display:none; width:0; height:0; }
    .streams.carousel.is-dragging { cursor:grabbing; scroll-snap-type:none!important; user-select:none; }
    .streams.carousel.is-dragging * { user-select:none; pointer-events:none; }
    .carousel .stream { flex:0 0 calc((100% - (var(--carousel-visible,1) - 1)*10px)/var(--carousel-visible,1)); scroll-snap-align:start; min-width:0; }
    .stream { position:relative; isolation:isolate; overflow:hidden;
      display:flex; align-items:center; gap:12px; min-width:0; min-height:116px;
      padding:12px; box-sizing:border-box; border-radius:12px; background:color-mix(in srgb,
      var(--primary-text-color,#fff) 4%,transparent); border:1px solid var(--divider-color,rgba(255,255,255,.12));
      color:var(--primary-text-color,#fff); }
    /* The inner edge follows the stream's rounded border instead of sitting
       outside the card. The old straight edge remains optional. */
    .stream::before { content:""; position:absolute; left:0; top:0; bottom:0;
      box-sizing:border-box; width:calc(var(--tr-edge-width,4px) + 10px);
      border-left:var(--tr-edge-width,4px) solid var(--stream-accent,var(--accent-color,#00BCD4));
      border-radius:11px 0 0 11px; z-index:3; pointer-events:none; }
    .stream.accent-straight::before { width:var(--tr-edge-width,4px); border-left:0;
      border-radius:0; background:var(--stream-accent,var(--accent-color,#00BCD4)); }
    .stream.accent-none::before { display:none; }
    .root.flat-streams .stream { background:transparent; }
    /* Blurred poster used purely as decoration; readable information stays
       above the dark overlay. Missing posters keep the ordinary dark surface. */
    .stream.surface-blur { background:#191a1d; }
    .stream-backdrop { position:absolute; inset:0; z-index:0;
      overflow:hidden; border-radius:inherit; pointer-events:none; }
    .stream-backdrop .backdrop-image { position:absolute; inset:0;
      width:100%; height:100%; display:block; object-fit:cover; object-position:center;
      filter:blur(var(--tr-stream-blur,26px)) saturate(1.18);
      transform:scale(1.25); }
    .stream-backdrop::after { content:""; position:absolute; inset:0;
      background:rgba(7,8,12,var(--tr-stream-overlay,.72)); }
    .stream > .poster-wrap, .stream > .info { position:relative; z-index:1; }
    .stream > .media-flags { z-index:2; }
    .poster-wrap { position:relative; width:var(--tr-poster-width,73px); height:var(--tr-poster-height,109px); flex:0 0 var(--tr-poster-width,73px); align-self:center;
      border-radius:7px; overflow:hidden; background:rgba(100,100,100,.15); }
    .poster { width:100%; height:100%; display:block; object-fit:cover; }
    .poster.empty { display:grid; place-items:center; font-size:calc(var(--tr-font-size)*1.8); }
    .poster-paused { position:absolute; inset:0; display:flex; justify-content:center; align-items:center;
      background:rgba(0,0,0,.48); }
    .pause-symbol { display:flex; gap:5px; align-items:center; justify-content:center; }
    .pause-symbol::before,.pause-symbol::after { content:""; display:block; background:#fff; border:1px solid rgba(0,0,0,.3);
      border-radius:2px; width:6px; height:24px; box-shadow:0 0 5px rgba(0,0,0,.45); }
    .info { min-width:0; flex:1; display:flex; flex-direction:column; gap:5px; align-self:stretch;
      color:var(--primary-text-color,#fff); }
    .user { display:flex; align-items:center; gap:6px; padding-right:54px;
      font-size:calc(var(--tr-font-size)*.92); color:inherit; }
    .avatar { width:23px; height:23px; border-radius:50%; object-fit:cover; background:rgba(100,100,100,.25); }
    .fallback-avatar { display:grid; place-items:center; font-size:calc(var(--tr-font-size)*.78); font-weight:bold; }
    .title { font-weight:700; font-size:calc(var(--tr-font-size)*1.12);
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .subtitle { font-size:calc(var(--tr-font-size)*.9); white-space:normal; overflow-wrap:anywhere; }
    .media-flags { display:flex; position:absolute; right:12px; top:12px; align-items:center; gap:8px; z-index:1; }
    .stream-indicator { width:19px; height:19px; display:inline-flex; align-items:center;
      justify-content:center; color:#a3a3a3; }
    .stream-indicator svg { width:100%; height:100%; fill:none; stroke:currentColor;
      stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
    .stream-indicator.direct { color:#12bb70; }
    .stream-indicator.transcode { color:#ff9900; }
    .progress { margin-top:auto; width:100%; height:6px; border-radius:7px; overflow:hidden;
      background:color-mix(in srgb,var(--shared-accent) 24%,transparent); }
    .fill { display:block; height:100%; background:var(--shared-accent);
      border-radius:7px; transition:width .3s linear; }
    .times { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:5px 8px;
      font-size:calc(var(--tr-font-size)*.82); font-variant-numeric:tabular-nums; }
    /* Read elapsed / remaining as one unit; predicted end stays at the right. */
    .time-left { display:inline-flex; align-items:baseline; gap:4px; white-space:nowrap; }
    .time-separator { opacity:.8; }
    .time-end { margin-left:auto; white-space:nowrap; opacity:.9; text-align:right; }
    @container (max-width:360px) { .time-left { white-space:normal; } }
    .time-paused { color:#ff9900; font-weight:700; }
    /* Footer information wraps freely; the poster remains vertically centered beside it. */
    .meta { display:flex; align-items:center; flex-wrap:wrap; gap:5px;
      margin-top:5px; padding-top:7px; border-top:1px solid var(--divider-color,rgba(255,255,255,.12));
      font-size:calc(var(--tr-font-size)*.80); }
    .chip { display:inline-flex; align-items:center; padding:3px 7px; border-radius:7px;
      background:var(--pill-bg); color:var(--pill-text); font-weight:600; }
    .chip.warn { background:color-mix(in srgb,#ff9900 14%,transparent); color:#ff9900; }
    .empty-message { text-align:center; padding:18px 8px;
      font-size:var(--tr-font-size); }
    .carousel-nav { display:flex; justify-content:center; align-items:center; gap:12px;
      margin-top:8px; font-size:calc(var(--tr-font-size)*.85); }
    button.nav { border:1px solid var(--divider-color,rgba(255,255,255,.18));
      background:transparent; color:var(--primary-text-color,#fff);
      border-radius:8px; padding:6px 11px; cursor:pointer; font-size:calc(var(--tr-font-size)*.95); }
    button.nav:focus-visible,.streams.carousel:focus-visible { outline:2px solid var(--focus-color,#00bcd4); outline-offset:2px; }
    .compact .stream { min-height:78px; padding:8px; gap:8px; }
    .compact .poster-wrap { width:var(--tr-compact-poster-width,48px); flex-basis:var(--tr-compact-poster-width,48px); height:var(--tr-compact-poster-height,72px); }
    .compact .user { font-size:calc(var(--tr-font-size)*.83); }
    .compact .info { gap:3px; }
    .compact .media-flags { top:8px; right:8px; }
    @container (max-width:520px) { .carousel .stream { flex-basis:100%!important; } }
    @media (prefers-reduced-motion:reduce) { .fill { transition:none; } .metric.blink-positive { animation:none; } }
  `;

  function normalizeConfig(config) {
    const result = {...DEFAULTS, ...config};
    // The old grid layout is replaced by the full-width list. Native Sections
    // owns sizing; retired internal sizing controls are never persisted again.
    if (!['list', 'carousel'].includes(result.mode)) result.mode = 'list';
    for (const key of ['columns','grid_columns','grid_rows','height']) delete result[key];
    // Pre-0.1.4 dashboards continue to behave the same until users change them.
    if (!("header_show_streams" in config)) result.header_show_streams = config.show_counter ?? true;
    if (config.show_transcodes && !["header_show_video","header_show_audio","header_show_both","header_show_transcodes_total"].some(k => k in config)) {
      result.header_show_video = result.header_show_audio = result.header_show_both = result.header_show_transcodes_total = true;
    }
    if (!("accent_color_mode" in config) && config.progress_color_mode) result.accent_color_mode = config.progress_color_mode;
    if (!("accent_custom_color" in config) && config.progress_custom_color) result.accent_custom_color = config.progress_custom_color;
    // A single pre-0.1.6 show_year switch controlled both movie and episode years.
    if (!("movie_show_year" in config) && "show_year" in config) result.movie_show_year = !!config.show_year;
    if (!("series_show_year" in config) && "show_year" in config) result.series_show_year = !!config.show_year;
    // Preserve existing dashboards: the old single switch controlled both numbers.
    if (!("series_show_season" in config) && "series_show_season_episode" in config)
      result.series_show_season = !!config.series_show_season_episode;
    if (!("series_show_episode_number" in config) && "series_show_season_episode" in config)
      result.series_show_episode_number = !!config.series_show_season_episode;
    result.movie_field_order = normalizedOrder(result.movie_field_order, MOVIE_FIELDS).join(",");
    result.footer_field_order = normalizedOrder(result.footer_field_order, FOOTER_FIELDS).join(",");
    // Place the newly separated episode number after season in old saved orders.
    const oldOrder = String(result.series_field_order || "").split(",").map(x => x.trim());
    if (!oldOrder.includes("episode_number")) {
      const seasonIndex = oldOrder.indexOf("season");
      oldOrder.splice(seasonIndex < 0 ? oldOrder.length : seasonIndex + 1, 0, "episode_number");
    }
    result.series_field_order = normalizedOrder(oldOrder.join(","), SERIES_FIELDS).join(",");
    if (!("empty_mode" in config) && config.hide_empty) result.empty_mode = "hide";
    if (!["message", "header_only", "hide"].includes(result.empty_mode)) result.empty_mode = "message";
    if (!["both", "local", "remote"].includes(result.bitrate_scope)) result.bitrate_scope = "both";
    result.poster_size = Math.round(clamp(result.poster_size, 50, 200, 100));
    if (!["soft","transparent","blur"].includes(result.stream_surface)) result.stream_surface = "soft";
    if (!["rounded","straight","none"].includes(result.stream_accent_style)) result.stream_accent_style = "rounded";
    result.stream_blur = Math.round(clamp(result.stream_blur,0,50,26));
    result.stream_overlay = Math.round(clamp(result.stream_overlay,25,95,72));
    result.stream_accent_width = Math.round(clamp(result.stream_accent_width,2,8,4));
    result.header_blink_seconds = clamp(result.header_blink_seconds, .5, 20, 2);
    // Per-statistic appearance inherits legacy global settings until changed.
    const rawMetrics = result.header_metric_settings && typeof result.header_metric_settings === "object" &&
      !Array.isArray(result.header_metric_settings) ? result.header_metric_settings : {};
    result.header_metric_settings = {};
    for (const key of HEADER_FIELDS) {
      const row = rawMetrics[key];
      if (!row || typeof row !== "object" || Array.isArray(row)) continue;
      result.header_metric_settings[key] = {
        align:badgeAlign(row.align),
        show_name:typeof row.show_name === "boolean" ? row.show_name : undefined,
        show_icon:!!row.show_icon,
        only_positive:!!row.only_positive,
        blink_positive:!!row.blink_positive,
        blink_seconds:row.blink_seconds == null ? undefined : clamp(row.blink_seconds,.5,20,2),
        zero_color_mode:row.zero_color_mode === "custom" ? "custom" : "inherit",
        zero_custom_color:validColor(row.zero_custom_color || "#576574"),
        label:String(row.label || "").slice(0,100),
        icon:/^(mdi|hass):[a-z0-9-]+$/.test(String(row.icon || "")) ? row.icon : "",
      };
    }
    result.header_entity_badges = Array.isArray(result.header_entity_badges) ? result.header_entity_badges.slice(0, 20)
      .filter(row => row && typeof row === "object" && typeof row.entity === "string")
      .map((row,i) => ({...row, id: String(row.id || `legacy-${i}`), entity:row.entity, label:String(row.label || ""),
        show_name: typeof row.show_name === "boolean" ? row.show_name : undefined,
        show_icon: !!row.show_icon,
        align:badgeAlign(row.align),
        only_positive: !!row.only_positive, blink_positive: !!row.blink_positive,
        blink_seconds: row.blink_seconds ? clamp(row.blink_seconds,.5,20,2) : undefined,
        zero_color_mode: row.zero_color_mode === "custom" ? "custom" : "inherit",
        zero_custom_color: validColor(row.zero_custom_color || "#576574"),
      })) : [];
    result.header_badge_order = normalizedOrder(result.header_badge_order,
      [...HEADER_FIELDS, ...result.header_entity_badges.map(row => `entity:${row.id}`)]).join(",");
    return result;
  }

  class BaseTracearrCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      // Capture image events inside the shadow root; <img> errors do not bubble.
      this.shadowRoot.addEventListener?.("error", event => this._onArtworkError(event), true);
      this.shadowRoot.addEventListener?.("load", event => this._onArtworkLoad(event), true);
      this._config = {...DEFAULTS};
      this._hass = null;
      this._payload = {entries: []};
      this._connection = null;
      this._unsubscribe = null;
      this._closed = false;
      this._images = new Map();
      this._imageRetryTimers = new Map();
      this._imageAttempts = new Map();
      this._positions = new Map();
      this._tick = null;
      this._carouselTimer = null;
      this._carouselFrame = null;
      this._carouselAnimating = false;
      this._carouselIndex = 0;
      this._renderFingerprint = null;
      this._liveFingerprints = new Map();
      this._headerMarkup = "";
      this._entry = null;
    }
    _language() { return languageFor(this._config, this._hass); }
    _t(text) { return translate(this._language(), text); }
    _labels(labels) { return Object.fromEntries(Object.entries(labels).map(([key,value]) => [key,this._t(value)])); }
    _count(count, french="flux") { return this._language() === "fr" ? `${count} ${french}` : `${count} stream${count === 1 ? "" : "s"}`; }
    static getStubConfig() { return {...DEFAULTS}; }
    static getConfigElement() { return document.createElement("tracearr-card-editor"); }
    setConfig(config) {
      if (!config || !["list", "grid", "carousel", undefined].includes(config.mode)) throw Error("Invalid Tracearr layout");
      this._config = normalizeConfig(config);
      this._renderFingerprint = null;
      this._liveFingerprints.clear();
      this._carouselIndex = 0;
      this._stopCarouselAnimation();
      this._setTimers();
      this.render();
    }
    set hass(hass) {
      const language = this._language();
      this._hass = hass;
      registerCards(languageFor({}, hass));
      if (language !== this._language()) { this._renderFingerprint = null; this.render(); }
      if (hass?.connection && this._connection !== hass.connection) this._subscribe(hass.connection);
      // Entity badges read the current HA state, independent of Tracearr SSE.
      // Updating only the header prevents unrelated sensor changes from resetting
      // the carousel animation, scroll position or playback clocks.
      if (this._config.header_entity_badges?.length && this._renderFingerprint !== null &&
          this.shadowRoot?.querySelector("ha-card")) this._refreshHeader(this._streams(this._entryData()));
    }
    connectedCallback() {
      this._closed = false;
      this._setTimers();
      if (this._hass?.connection && !this._connection) this._subscribe(this._hass.connection);
    }
    disconnectedCallback() {
      this._closed = true;
      clearInterval(this._tick);
      clearInterval(this._carouselTimer);
      this._stopCarouselAnimation();
      this._tick = null;
      this._carouselTimer = null;
      if (this._unsubscribe) this._unsubscribe();
      this._unsubscribe = null;
      this._connection = null;
      for (const timer of this._imageRetryTimers.values()) clearTimeout(timer);
      this._imageRetryTimers.clear();
    }
    _subscribe(connection) {
      if (this._unsubscribe) this._unsubscribe();
      this._unsubscribe = null;
      this._connection = connection;
      connection.subscribeMessage((data) => {
        if (this._closed) return;
        this._payload = data || {entries: []};
        this.render();
      }, {type: "tracearr_ha/subscribe"}).then((unsubscribe) => {
        if (this._closed || this._connection !== connection) unsubscribe();
        else this._unsubscribe = unsubscribe;
      }).catch(() => { this._payload = {entries: []}; this.render(); });
    }
    getCardSize() { return this._config.mode === "list" ? 5 : 4; }
    getGridOptions() {
      // HA Sections controls the persisted grid_options via its Layout tab.
      // Only advertise compatible default/min/max dimensions here.
      return {columns:12, min_columns:3, max_columns:12,
        rows:4, min_rows:2, max_rows:30};
    }
    _setTimers() {
      clearInterval(this._tick);
      clearInterval(this._carouselTimer);
      this._tick = this._carouselTimer = null;
      if (this._closed) return;
      this._tick = setInterval(() => this._updateProgress(), 250);
      this._armCarouselAutoplay();
    }
    _armCarouselAutoplay() {
      clearInterval(this._carouselTimer);
      this._carouselTimer = null;
      if (this._closed || this._config.mode !== "carousel" || !this._config.carousel_autoplay) return;
      const duration = clamp(this._config.carousel_interval, 3, 120, 7);
      this._carouselTimer = setInterval(() => {
        if (!this.isConnected || (this._config.carousel_pause_on_hover && this.matches(":hover")) || document.hidden || window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
        this._scroll(1, true);
      }, duration * 1000);
    }
    _entryData() {
      const all = this._payload?.entries || [];
      return all.find(e => e.id === this._config.entry_id) || all[0] || null;
    }
    _mapping(entry, field) { return {...asMapping(entry?.[field]), ...asMapping(this._config[field])}; }
    _key(s) { return `${s.server_type}:${s.username}`; }
    _name(entry, s) {
      const map = this._mapping(entry, "aliases");
      return map[`${s.server_id}:${s.username}`] || map[this._key(s)] || map[`${s.server_name}:${s.username}`] || map[s.username] || s.username || this._t("Inconnu");
    }
    _avatar(entry, s) {
      const map = this._mapping(entry, "avatars");
      return safeImage(map[`${s.server_id}:${s.username}`] || map[this._key(s)] || map[s.username]) || "";
    }
    _streams(entry) {
      let streams = [...(entry?.streams || [])];
      if (!this._config.show_paused) streams = streams.filter(s => s.state === "playing");
      // An explicit individual-card target takes priority over stale generic
      // filters saved by an older dashboard configuration.
      const targeted = this._individual && ["stream", "account", "server"].includes(this._config.selection);
      if (!targeted && this._config.filter_server) streams = streams.filter(s => s.server_id === this._config.filter_server || s.server_name === this._config.filter_server);
      if (!targeted && this._config.filter_user) {
        const desired = String(this._config.filter_user).toLocaleLowerCase();
        streams = streams.filter(s => [s.username, this._name(entry,s)].some(n => String(n||"").toLocaleLowerCase() === desired));
      }
      if (this._config.filter_transcode && this._config.filter_transcode !== "all") streams = streams.filter(s => transcodeMode(s) === this._config.filter_transcode);
      const sort = this._config.sort;
      if (sort === "user") streams.sort((a,b) => this._name(entry,a).localeCompare(this._name(entry,b)));
      else if (sort === "server") streams.sort((a,b) => a.server_name.localeCompare(b.server_name));
      else streams.sort((a,b) => String(b.started_at).localeCompare(String(a.started_at)));
      if (this._individual) {
        const selection=this._config.selection;
        if (selection === "stream")
          streams = streams.filter(s => !!this._config.stream_id && String(s.id) === String(this._config.stream_id));
        else if (selection === "account")
          streams = streams.filter(s => !!this._config.selected_account && `${s.server_id}:${s.username}` === this._config.selected_account);
        else if (selection === "server")
          streams = streams.filter(s => !!this._config.selected_server && s.server_id === this._config.selected_server);
        return streams.slice(0, 1);
      }
      return streams;
    }
    _artworkPath(entry, stream, kind) {
      return `/api/tracearr_ha/image/${encodeURIComponent(entry.id)}/${encodeURIComponent(stream.id)}/${kind}`;
    }
    _image(entry,s,kind) {
      const direct = kind === "avatar" ? this._avatar(entry,s) : "";
      if (direct) return direct;
      const raw = kind === "poster" ? s.poster_url : s.user_avatar_url;
      if (!raw) return "";
      // Keep external URLs direct: the HA proxy must never fetch arbitrary hosts.
      if (typeof raw === "string" && /^https?:\/\//i.test(raw) && !raw.includes("/api/v1/images/proxy")) return safeImage(raw);
      if (!entry?.id || !s?.id) return "";
      const path = this._artworkPath(entry,s,kind);
      const cached = this._images.get(path);
      if (cached?.raw === raw && cached.expires > Date.now()) return cached.url || "";
      if (cached?.pending && cached.raw === raw) return "";
      if (this._hass?.connection) {
        // A signature arriving after the initial render must update the image
        // directly: unchanged SSE fingerprints otherwise leave placeholders forever.
        const pending = this._hass.connection.sendMessagePromise({type:"auth/sign_path", path, expires:600})
          .then(result => {
            if (this._images.get(path)?.raw !== raw) return;
            if (typeof result?.path !== "string" || !result.path.startsWith("/")) throw Error("Invalid signed image path");
            this._images.set(path,{url:result.path,raw,expires:Date.now()+540000});
            if (!this._closed) this._applyArtwork(s.id,kind,result.path);
          })
          .catch(() => {
            if (this._images.get(path)?.raw !== raw) return;
            this._images.delete(path);
            this._scheduleImageRetry(entry,s,kind);
          });
        this._images.set(path,{pending,raw,expires:Date.now()+60000});
      }
      return "";
    }
    _applyArtwork(sessionId,kind,url) {
      if (!url || !this.shadowRoot) return;
      // Replace only the relevant image, never the carousel/stream container.
      for (const card of this.shadowRoot.querySelectorAll(".stream")) {
        if (card.dataset.session !== String(sessionId)) continue;
        const target = kind === "poster" ? card.querySelector(".poster-wrap .poster") :
          card.querySelector(".user .avatar");
        if (target && !(target.tagName === "IMG" && target.getAttribute("src") === url)) {
          const css = kind === "poster" ? "poster" : "avatar";
          const alt = kind === "poster" ? this._t("Affiche") : "";
          target.outerHTML = `<img class="${css}" data-kind="${kind}" src="${E(url)}" alt="${alt}" loading="eager" decoding="async">`;
        }
        // Signed artwork may arrive after the backdrop was initially rendered.
        // Update its image in place, preserving the live carousel DOM and index.
        if (kind === "poster") {
          const backdrop = card.querySelector(".stream-backdrop .backdrop-image, .stream-backdrop .backdrop-empty");
          if (backdrop && !(backdrop.tagName === "IMG" && backdrop.getAttribute("src") === url)) {
            const track = this._config.show_poster ? "" : ' data-kind="poster"';
            backdrop.outerHTML = `<img class="backdrop-image"${track} src="${E(url)}" alt="" decoding="async">`;
          }
        }
      }
    }
    _scheduleImageRetry(entry,stream,kind) {
      if (!entry?.id || !stream?.id || this._closed) return;
      const path = this._artworkPath(entry,stream,kind);
      if (this._imageRetryTimers.has(path)) return;
      const count = (this._imageAttempts.get(path) || 0) + 1;
      if (count > 3) return;
      this._imageAttempts.set(path,count);
      const delay = [2000,5000,15000][count-1];
      const timer = setTimeout(() => {
        this._imageRetryTimers.delete(path);
        if (this._closed) return;
        const currentEntry = this._entryData();
        const current = currentEntry?.streams?.find(item => String(item.id) === String(stream.id));
        if (!current || !(kind === "poster" ? (this._config.show_poster || this._config.stream_surface === "blur") : this._config.show_avatar)) return;
        this._images.delete(path);
        const url = this._image(currentEntry,current,kind);
        if (url) this._applyArtwork(stream.id,kind,url);
      },delay);
      this._imageRetryTimers.set(path,timer);
    }
    _onArtworkError(event) {
      const img = event.target;
      const kind = img?.getAttribute?.("data-kind");
      if (kind !== "poster" && kind !== "avatar") return;
      const sessionId = img.closest?.(".stream")?.dataset?.session;
      const entry = this._entryData();
      const stream = entry?.streams?.find(s => String(s.id) === sessionId);
      if (!stream) return;
      const path = this._artworkPath(entry,stream,kind);
      const cached = this._images.get(path);
      // Ignore errors from an older URL if a newer signature already exists.
      if (cached?.url && cached.url !== img.getAttribute("src")) return;
      const isBackdrop = !!img.classList?.contains?.("backdrop-image");
      const fallback = kind === "poster" ?
        (isBackdrop ? '<div class="backdrop-empty"></div>' : '<div class="poster empty">▣</div>') :
        `<span class="avatar fallback-avatar">${E(this._name(entry,stream).slice(0,1).toUpperCase())}</span>`;
      // A failed foreground image must not leave a broken blurred image behind.
      const background = !isBackdrop && kind === "poster" ?
        img.closest?.(".stream")?.querySelector?.(".stream-backdrop .backdrop-image") : null;
      if (background) background.outerHTML = '<div class="backdrop-empty"></div>';
      img.outerHTML = fallback;
      this._images.delete(path);
      this._scheduleImageRetry(entry,stream,kind);
    }
    _onArtworkLoad(event) {
      const img = event.target;
      const kind = img?.getAttribute?.("data-kind");
      if (kind !== "poster" && kind !== "avatar") return;
      const sessionId = img.closest?.(".stream")?.dataset?.session;
      const entry = this._entryData();
      const stream = entry?.streams?.find(s => String(s.id) === sessionId);
      if (!stream) return;
      const path = this._artworkPath(entry,stream,kind);
      this._imageAttempts.delete(path);
      const timer = this._imageRetryTimers.get(path);
      if (timer !== undefined) clearTimeout(timer);
      this._imageRetryTimers.delete(path);
    }
    _themeAccent() {
      // Use the theme's true RGB value for legible foreground contrast.
      // The CSS var itself remains the color source so theme changes propagate.
      try {
        if (typeof getComputedStyle !== "function") return "#00BCD4";
        const style = getComputedStyle(this);
        const raw = style.getPropertyValue("--accent-color").trim() ||
          getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
        if (readRgb(raw)) return raw;
        if (typeof document.createElement === "function") {
          const helper = document.createElement("span");
          helper.style.color = raw || "#00BCD4";
          (this.shadowRoot || this).appendChild(helper);
          const resolved = getComputedStyle(helper).color;
          helper.remove();
          if (readRgb(resolved)) return resolved;
        }
      } catch (_) { /* detached editor preview or browser without computed styles */ }
      return "#00BCD4";
    }
    _palette(serverType, forceTheme=false) {
      const mode = forceTheme && this._config.accent_color_mode === "server" ? "theme" : this._config.accent_color_mode;
      const raw = mode === "server" ? SERVER_ACCENTS[String(serverType||"").toLowerCase()] :
        mode === "custom" ? validColor(this._config.accent_custom_color) : null;
      const cssColor = raw || "var(--accent-color,#00BCD4)";
      const foreground = contrastColor(raw || this._themeAccent());
      return {bg:cssColor, text:foreground};
    }
    _headerPalette(serverType) {
      const mode = this._config.header_badge_color_mode || "inherit";
      if (mode === "inherit") return this._palette(serverType, !serverType);
      if (mode === "server") return this._paletteForMode("server", serverType);
      if (mode === "custom") return this._paletteForMode("custom", serverType, this._config.header_badge_custom_color);
      return this._paletteForMode("theme", serverType);
    }
    _paletteForMode(mode, serverType, customColor) {
      const raw = mode === "server" ? SERVER_ACCENTS[String(serverType || "").toLowerCase()] :
        mode === "custom" ? validColor(customColor) : null;
      const bg = raw || "var(--accent-color,#00BCD4)";
      return {bg, text:contrastColor(raw || this._themeAccent())};
    }
    _mediaFields(stream) {
      const c = this._config;
      const episode = stream.media_type === "episode";
      if (!episode) {
        const fields = {
          title: c.movie_show_title && stream.media_title ? stream.media_title : "",
          year: c.movie_show_year && stream.year != null ? String(stream.year) : "",
        };
        return normalizedOrder(c.movie_field_order, MOVIE_FIELDS)
          .map(key => ({key, text:fields[key]})).filter(item => item.text);
      }
      const season = stream.season_number;
      const episodeNum = stream.episode_number;
      const long = c.series_episode_style === "long";
      const fields = {
        series: c.series_show_title && stream.show_title ? stream.show_title : "",
        season: c.series_show_season && season != null ?
          (long ? `${E(this._t("Saison"))} ${season}` : `S${String(season).padStart(2,"0")}`) : "",
        episode_number: c.series_show_episode_number && episodeNum != null ?
          (long ? `${E(this._t("Épisode"))} ${episodeNum}` : `E${String(episodeNum).padStart(2,"0")}`) : "",
        episode: c.series_show_episode_title && stream.media_title ? stream.media_title : "",
        year: c.series_show_year && stream.year != null ? String(stream.year) : "",
      };
      return normalizedOrder(c.series_field_order, SERIES_FIELDS)
        .map(key => ({key, text:fields[key]})).filter(item => item.text);
    }
    _mediaMarkup(stream) {
      const fields = this._mediaFields(stream);
      if (!fields.length) return "";
      const parts = [];
      for (const field of fields) {
        // Join S01 + E02 only when adjacent, preserving the user's field order.
        if (stream.media_type === "episode" && this._config.series_episode_style !== "long" &&
            field.key === "episode_number" && parts.length && parts.at(-1).key === "season") {
          parts[parts.length-1] = {key:"season_episode", text:parts.at(-1).text + field.text};
        } else parts.push(field);
      }
      return `<div class="title" title="${E(parts[0].text)}">${E(parts[0].text)}</div>` +
        (parts.length > 1 ? `<div class="subtitle">${parts.slice(1).map(field=>E(field.text)).join(" · ")}</div>` : "");
    }
    // Tracearr v2 has no local/WAN flag or client IP in /streams.
    // Users can explicitly map stable server-account and client-device names.
    _networkScope(stream) {
      const direct = String(stream.network_type || stream.network || "").toLowerCase();
      // Global device rules live in the integration options; individual cards
      // can override them without changing the settings of other dashboards.
      const globalMapping = asMapping(this._entryData()?.network_locations);
      const cardMapping = asMapping(this._config.network_locations);
      const candidates = [
        stream.device && stream.server_id && `${stream.server_id}:device:${stream.device}`,
        stream.player && stream.server_id && `${stream.server_id}:player:${stream.player}`,
        stream.server_id && stream.username && `${stream.server_id}:${stream.username}`,
        // Server-wide defaults beat generic device rules, but never override
        // an explicitly server-scoped device or user exception.
        stream.server_id && `server:${stream.server_id}`,
        stream.device && `device:${stream.device}`,
        stream.player && `player:${stream.player}`,
        stream.username && `${stream.server_type}:${stream.username}`,
        stream.username && `${stream.server_name}:${stream.username}`,
        stream.username,
      ].filter(Boolean);
      // A card exception takes precedence even if the global rule uses a more
      // specific server-scoped key than the card's unscoped device name.
      const location = candidates.map(key => cardMapping[key]).find(Boolean)
        || candidates.map(key => globalMapping[key]).find(Boolean) || direct;
      const value = String(location).trim().toLowerCase();
      if (["local", "lan", "interne"].includes(value)) return "local";
      if (["remote", "wan", "distant", "externe"].includes(value)) return "remote";
      return "unknown";
    }
    _includeBitrate(stream) {
      const scope = this._config.bitrate_scope || "both";
      return scope === "both" || this._networkScope(stream) === scope;
    }
    _streamSummary(streams) {
      const sums = {total:streams.length, direct:0, video:0, audio:0, both:0,
        transcodes:0, unknown:0, paused:0, bandwidth:0, byServer:new Map()};
      for (const s of streams) {
        const kind = transcodeMode(s);
        sums[kind]++;
        if (kind === "video" || kind === "audio" || kind === "both" || s.is_transcode) sums.transcodes++;
        if (s.state === "paused") sums.paused++;
        if (this._includeBitrate(s)) sums.bandwidth += Math.max(0, Number(s.bitrate) || 0);
        const id = s.server_id || `${s.server_type}:${s.server_name}`;
        const row = sums.byServer.get(id) || {name:s.server_name || s.server_type || this._t("Serveur"),type:s.server_type,count:0};
        row.count++;
        sums.byServer.set(id,row);
      }
      return sums;
    }
    _header(streams) {
      const c = this._config;
      if (!c.show_header) return "";
      const summary = this._streamSummary(streams);
      const metrics = new Map();
      // Every Tracearr statistic and HA entity can override the common style
      // and choose its own horizontal position without changing badge order.
      const add = (key, enabled, name, display, value, colorType=null, custom=null) => {
        if (!enabled) return;
        if (!key.startsWith("entity:")) custom = c.header_metric_settings?.[key] || {};
        const count = Number(value);
        const positive = Number.isFinite(count) && count > 0;
        const hideZero = c.header_positive_only || !!custom?.only_positive;
        if (hideZero && !positive) return;
        const blinking = positive && (c.header_blink_positive || !!custom?.blink_positive);
        const duration = clamp(custom?.blink_seconds ?? c.header_blink_seconds,.5,20,2);
        const zeroMode = custom?.zero_color_mode === "custom" ? "custom" : c.header_zero_color_mode;
        const zeroColor = custom?.zero_color_mode === "custom" ? custom.zero_custom_color : c.header_zero_custom_color;
        const palette = !positive && zeroMode === "custom" ? this._paletteForMode("custom",null,zeroColor) : this._headerPalette(colorType);
        const showName = custom?.show_name ?? c.header_show_names;
        const displayName = String(custom?.label || "").trim() || name;
        const safeIcon = String(custom?.icon || HEADER_ICONS[key] || "");
        const iconMarkup = custom?.show_icon && /^(mdi|hass):[a-z0-9-]+$/.test(safeIcon) ?
          `<ha-icon icon="${E(safeIcon)}" aria-hidden="true"></ha-icon>` : "";
        const output = `${showName && displayName ? `${E(displayName)} : ` : ""}${E(display)}`;
        const markup = `<span class="metric${blinking ? " blink-positive" : ""}" style="--pill-bg:${palette.bg};--pill-text:${palette.text};--badge-blink:${duration}s" title="${E(displayName || display)}">${iconMarkup}${output}</span>`;
        const position = badgeAlign(custom?.align);
        const align = position === "auto" ? (c.show_title ? "right" : "left") : position;
        metrics.set(key, [...(metrics.get(key) || []), {align,markup}]);
      };
      // Preserve the existing stream-count format "2 flux" when names are on.
      const streamSettings = c.header_metric_settings?.streams;
      const streamLabel = String(streamSettings?.label || "").trim();
      const showStreamName = streamSettings?.show_name ?? c.header_show_names;
      add("streams", c.header_show_streams, streamLabel,
        streamLabel ? String(summary.total) : (showStreamName ? this._count(summary.total) : String(summary.total)), summary.total);
      const bandwidthTitle = c.bitrate_scope === "local" ? this._t("Débit local") :
        c.bitrate_scope === "remote" ? this._t("Débit distant") : this._t("Débit");
      add("bandwidth", c.header_show_bandwidth, bandwidthTitle, `${(summary.bandwidth/1000).toFixed(1)} Mb/s`, summary.bandwidth);
      add("direct", c.header_show_direct, this._t("Direct"), summary.direct, summary.direct);
      add("paused", c.header_show_paused, this._t("Pause"), summary.paused, summary.paused);
      add("video", c.header_show_video, this._t("Vidéo"), summary.video, summary.video);
      add("audio", c.header_show_audio, this._t("Audio"), summary.audio, summary.audio);
      add("both", c.header_show_both, this._t("Vidéo + audio"), summary.both, summary.both);
      add("transcodes_total", c.header_show_transcodes_total, this._t("Transcodes"), summary.transcodes, summary.transcodes);
      if (c.header_show_server_counts) {
        for (const server of summary.byServer.values()) add("server_counts",true,server.name,server.count,server.count,server.type);
      }
      // Custom badges consume the entity's current state, unit and icon.
      for (const row of c.header_entity_badges || []) {
        const id = String(row.entity || "");
        if (!/^[a-z_]+\.[a-z0-9_]+$/.test(id)) continue;
        const state = this._hass?.states?.[id];
        const name = String(row.label || state?.attributes?.friendly_name || id);
        const value = state?.state == null ? this._t("Indisponible") : String(state.state);
        const unit = state?.attributes?.unit_of_measurement;
        const units = unit && !["unknown", "unavailable"].includes(value) ? ` ${unit}` : "";
        const domain = id.split(".")[0];
        const fallback = ({counter:"mdi:counter", sensor:"mdi:gauge", binary_sensor:"mdi:check-circle-outline",
          input_number:"mdi:numeric", number:"mdi:numeric", light:"mdi:lightbulb", switch:"mdi:toggle-switch"})[domain] || "mdi:information-outline";
        add(`entity:${row.id}`, true, name, `${value}${units}`, value, null, {...row,icon:state?.attributes?.icon || fallback});
      }
      const title = c.show_title ? `<h3>${E(c.title || this._t("Lectures en cours"))}</h3>` : "";
      const order = normalizedOrder(c.header_badge_order,
        [...HEADER_FIELDS, ...(c.header_entity_badges || []).map(row => `entity:${row.id}`)]);
      const orderedMetrics = order.flatMap(key => metrics.get(key) || []);
      if (!title && !orderedMetrics.length) return "";
      const groups = {left:[],center:[],right:[]};
      for (const badge of orderedMetrics) groups[badge.align].push(badge.markup);
      const populated = ["left","center","right"].filter(position => groups[position].length);
      // No empty group in the DOM: a missing center must not reserve a column.
      // Keep symmetrical tracks only for multiple groups with a real center badge.
      const layout = populated.length === 1 && populated[0] === "center" ? " only-center" :
        populated.includes("center") ? " with-center" : "";
      const badgeMarkup = orderedMetrics.length ?
        `<div class="head-metrics${layout}">${populated.map(position =>
          `<div class="head-group align-${position}">${groups[position].join("")}</div>`).join("")}</div>` : "";
      return `<header class="head${title ? "" : " no-title"}">${title}${badgeMarkup}</header>`;
    }
    // API samples may be slightly older than the local playback time. Keep a
    // monotonic client-side clock for ordinary SSE updates; only snap when the
    // *difference between two API samples* is evidence of a real seek.
    _now() { return performance.now(); }
    _positionAt(clock, now=this._now()) {
      if (!clock) return 0;
      const delta = clock.state === "playing" ? Math.max(0, now - clock.at) : 0;
      return clock.duration > 0 ? Math.min(clock.duration, clock.progress + delta) : clock.progress + delta;
    }
    _syncPosition(stream, now=this._now()) {
      const id = stream.id;
      const duration = Math.max(0, Number(stream.duration_ms) || 0);
      const source = Math.max(0, Math.min(duration || Infinity, Number(stream.progress_ms) || 0));
      const state = stream.state === "playing" ? "playing" : "paused";
      // Session IDs can be reused; do not preserve an old film's clock.
      const media = [stream.started_at || "", stream.media_id || stream.rating_key || stream.media_title || ""].join("|");
      const old = this._positions.get(id);
      if (!old || old.media !== media || (old.duration && duration && Math.abs(old.duration-duration) > 10000)) {
        const fresh = {progress:source, at:now, duration, state, media,
          lastRaw:source, lastRawAt:now, lastRendered:source};
        this._positions.set(id, fresh);
        return fresh;
      }
      const predicted = this._positionAt(old, now);
      const sinceRaw = Math.max(0, now - old.lastRawAt);
      const sampleDelta = source - old.lastRaw;
      // Rewinds greater than 4 seconds or a jump > 8 seconds beyond the
      // elapsed time since the previous distinct source sample indicate seeks.
      // Ordinary delayed/stale samples never force a backward jump.
      const seek = sampleDelta < -4000 || sampleDelta > sinceRaw + 8000;
      let position = seek ? source : predicted;
      if (!seek && source !== old.lastRaw) {
        // Gentle drift correction: at most 200ms per new API sample, so a 2s
        // sample cadence can never create a visible 2s leap or rewind.
        const error = source - predicted;
        position += Math.max(-200, Math.min(200, error * 0.12));
      }
      if (!seek && state === "paused") {
        // Paused streams must not drift or be nudged by delayed progress packets;
        // a deliberate seek is the only reason to change a paused position.
        position = old.state === "playing" ? Math.max(predicted, old.lastRendered) :
          Math.max(old.progress, old.lastRendered);
      }
      if (!seek) position = Math.max(position, old.lastRendered);
      old.progress = duration > 0 ? Math.min(duration, position) : position;
      old.at = now;
      old.duration = duration;
      old.state = state;
      if (seek) old.lastRendered = old.progress;
      if (source !== old.lastRaw) {
        old.lastRaw = source;
        old.lastRawAt = now;
      }
      return old;
    }
    _streamCard(entry,s) {
      const c = this._config;
      const blurred = c.stream_surface === "blur";
      const poster = c.show_poster || blurred ? this._image(entry,s,"poster") : "";
      const avatar = c.show_avatar ? this._image(entry,s,"avatar") : "";
      const name = this._name(entry,s);
      const mediaMarkup = this._mediaMarkup(s);
      const clock = this._syncPosition(s);
      const displayPosition = Math.max(clock.lastRendered, this._positionAt(clock));
      const ratio = clock.duration > 0 ? 100 * Math.min(1, displayPosition / clock.duration) : 0;
      const timePair = playbackSeconds(displayPosition, clock.duration);
      const endLabel = c.show_end_time && clock.state === "playing" && clock.duration > 0 ?
        `<span class="time-end" data-id="${E(s.id)}">${E(this._t("Fin à"))} ${E(estimatedEnd(clock,displayPosition,Date.now(),this._language()))}</span>` : "";
      const paused = s.state === "paused";
      const metaByKey = {};
      if (c.show_health && entry?.servers?.find(server => server.server_id === s.server_id)?.status === "down") metaByKey.health = (`<span class="chip warn">${E(this._t("Serveur hors ligne"))}</span>`);
      if (c.show_server) metaByKey.server = `<span>${E(s.server_name || s.server_type || "")}</span>`;
      if (c.show_device && (s.device || s.player)) metaByKey.device = `<span>${E(s.device || s.player)}</span>`;
      if (c.show_quality && s.resolution) metaByKey.quality = `<span class="chip">${E(s.resolution)}</span>`;
      // The separate video/audio icons take the place of the old text badge.
      if (c.show_bitrate && this._includeBitrate(s) && s.bitrate != null)
        metaByKey.bitrate = `<span class="chip">${E((s.bitrate/1000).toFixed(1))} Mb/s</span>`;
      if (c.show_codecs && (s.stream_video_codec_display || s.stream_audio_codec_display)) metaByKey.codecs = `<span>${E([s.stream_video_codec_display,s.stream_audio_codec_display].filter(Boolean).join(" / "))}</span>`;
      const meta = normalizedOrder(c.footer_field_order, FOOTER_FIELDS).map(k => metaByKey[k]).filter(Boolean);
      const accent = SERVER_ACCENTS[String(s.server_type || "").toLowerCase()] || "var(--tr-accent)";
      const palette = this._palette(s.server_type);
      const sharedStyle = `--shared-accent:${palette.bg};--pill-bg:${palette.bg};--pill-text:${palette.text};--tr-stream-blur:${clamp(c.stream_blur,0,50,26)}px;--tr-stream-overlay:${clamp(c.stream_overlay,25,95,72)/100};--tr-edge-width:${clamp(c.stream_accent_width,2,8,4)}px`;
      const edgeMode = ["rounded","straight","none"].includes(c.stream_accent_style) ? c.stream_accent_style : "rounded";
      // Use the existing poster URL (no external backdrop requests).
      const backdropMarkup = blurred ? `<div class="stream-backdrop" aria-hidden="true">${poster ?
        `<img class="backdrop-image"${c.show_poster ? "" : ' data-kind="poster"'} src="${E(poster)}" alt="" decoding="async">` :
        '<div class="backdrop-empty"></div>'}</div>` : "";
      const indicators = c.show_transcode_icons ? `<div class="media-flags" aria-label="${E(this._t("État du flux audio et vidéo"))}">${["video","audio"].map(kind => {
        const decision = kind === "video" ? s.video_decision : s.audio_decision;
        const state = codecState(decision);
        const tip = `${kind === "video" ? this._t("Vidéo") : this._t("Audio")} : ${state === "transcode" ? this._t("Transcodage") : state === "direct" ? this._t("Lecture directe") : this._t("Inconnu")}`;
        return `<span class="stream-indicator ${state}" role="img" aria-label="${E(tip)}" title="${E(tip)}">${badgeIcon(kind)}</span>`;
      }).join("")}</div>` : "";
      const posterMarkup = c.show_poster ? `<div class="poster-wrap">${poster ? `<img class="poster" data-kind="poster" src="${E(poster)}" alt="Affiche" loading="eager" decoding="async">` : `<div class="poster empty">▣</div>`}${paused ? `<span class="poster-paused" aria-label="${E(this._t("Lecture en pause"))}"><span class="pause-symbol" aria-hidden="true"></span></span>` : ""}</div>` : "";
      return `<article class="stream accent-${edgeMode}${blurred ? " surface-blur" : ""}" data-session="${E(s.id)}" style="--stream-accent:${accent};${sharedStyle}">
        ${backdropMarkup}
        ${posterMarkup}
        ${indicators}
        <div class="info">
          ${c.show_avatar ? `<div class="user">${avatar ? `<img class="avatar" data-kind="avatar" src="${E(avatar)}" alt="" loading="eager" decoding="async">` : `<span class="avatar fallback-avatar">${E(name.slice(0,1).toUpperCase())}</span>`}<span>${E(name)}</span></div>` : `<div class="user">${E(name)}</div>`}
          ${mediaMarkup}
          ${c.show_progress ? `<div class="progress"><span class="fill" data-id="${E(s.id)}" style="width:${ratio.toFixed(2)}%"></span></div>` : ""}
          ${c.show_progress || c.show_end_time ? `<div class="times"><span class="time-left"><span class="time-current" data-id="${E(s.id)}">${formattedSeconds(timePair.elapsed)}</span>${paused ? `<span class="time-separator">/</span><span class="time-paused">${E(this._t("En pause"))}</span>` : c.show_remaining && c.show_progress ? `<span class="time-separator">/</span><span class="time-remaining" data-id="${E(s.id)}">-${formattedSeconds(timePair.remaining)}</span>` : ""}</span>${endLabel}</div>` : ""}
          ${meta.length ? `<div class="meta">${meta.join("<span aria-hidden=\"true\">·</span>")}</div>` : ""}
        </div>
      </article>`;
    }
    _updateProgress() {
      if (!this.shadowRoot || !this.isConnected) return;
      // Capture one monotonic tick shared by the bar, elapsed, remaining and
      // end-time estimate. All visible seconds derive from the same integer.
      const now = this._now();
      const wallNow = Date.now();
      this.shadowRoot.querySelectorAll(".time-current[data-id]").forEach(currentNode => {
        const id = currentNode.dataset.id;
        const item = this._positions.get(id);
        if (!item || !item.duration) return;
        const current = Math.max(item.lastRendered, this._positionAt(item,now));
        item.lastRendered = Math.min(item.duration, current);
        const pair = playbackSeconds(item.lastRendered,item.duration);
        const selectorId = CSS.escape(id);
        const fillNode = this.shadowRoot.querySelector(`.fill[data-id="${selectorId}"]`);
        if (fillNode) fillNode.style.width = `${(100*item.lastRendered/item.duration).toFixed(2)}%`;
        const left = formattedSeconds(pair.elapsed);
        if (currentNode.textContent !== left) currentNode.textContent = left;
        const remainingNode = this.shadowRoot.querySelector(`.time-remaining[data-id="${selectorId}"]`);
        if (remainingNode) {
          const right = `-${formattedSeconds(pair.remaining)}`;
          if (remainingNode.textContent !== right) remainingNode.textContent = right;
        }
        const endNode = this.shadowRoot.querySelector(`.time-end[data-id="${selectorId}"]`);
        if (endNode) {
          const end = estimatedEnd(item,item.lastRendered,wallNow,this._language());
          const label = end ? `${E(this._t("Fin à"))} ${end}` : "";
          if (endNode.textContent !== label) endNode.textContent = label;
        }
      });
    }
    _stopCarouselAnimation() {
      if (this._carouselFrame !== null) cancelAnimationFrame(this._carouselFrame);
      this._carouselFrame = null;
      this._carouselAnimating = false;
      const el = this.shadowRoot?.querySelector(".streams.carousel");
      if (el) el.style.scrollSnapType = "";
    }
    _carouselVisibleCount(el, cards) {
      // Container queries may force a single stream on small dashboard cards.
      // Use the actual rendered size instead of blindly trusting the editor value.
      const configured = clamp(this._config.carousel_visible, 1, 4, 1);
      const first = cards?.[0];
      const width = first?.getBoundingClientRect?.().width;
      if (!el?.clientWidth || !Number.isFinite(width) || width <= 0) return configured;
      const gap = 10;
      return clamp(Math.floor((el.clientWidth + gap + 1) / (width + gap)), 1, 4, 1);
    }
    _carouselMaxIndex(count, el, cards) {
      const visible = this._carouselVisibleCount(el, cards);
      return Math.max(0, count - visible);
    }
    _goToCarouselIndex(el, cards, index) {
      const first = cards[0];
      const target = cards[index];
      if (!first || !target) return;
      const left = target.offsetLeft - first.offsetLeft;
      this._stopCarouselAnimation();
      const duration = clamp(this._config.carousel_transition_speed, 100, 3000, 600);
      const chosen = this._config.carousel_transition;
      const effect = TRANSITION_EFFECTS.includes(chosen) ? chosen : "slide";
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (effect !== "slide" || reducedMotion) {
        // Different effects switch pages directly, then animate the incoming cards.
        // This also works with multiple visible streams (unlike stacked slides).
        el.scrollLeft = left;
        if (!reducedMotion && effect !== "none") {
          const frames = {
            fade: [{opacity: 0}, {opacity: 1}],
            zoom: [{opacity: 0.3, transform: "scale(.86)"}, {opacity: 1, transform: "scale(1)"}],
            flip: [{opacity: 0.4, transform: "perspective(900px) rotateY(-75deg)"}, {opacity: 1, transform: "perspective(900px) rotateY(0deg)"}],
          }[effect];
          if (frames) {
            cards.slice(index, index + this._carouselVisibleCount(el, cards)).forEach(card => {
              if (typeof card.animate === "function") card.animate(frames, {duration, easing: "ease-in-out"});
            });
          }
        }
        return;
      }
      if (Math.abs(el.scrollLeft - left) < 1) return;
      const from = el.scrollLeft;
      const start = performance.now();
      el.style.scrollSnapType = "none";
      this._carouselAnimating = true;
      const step = (now) => {
        if (!this.isConnected) { this._stopCarouselAnimation(); return; }
        const progress = Math.min(1, Math.max(0, (now - start) / duration));
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
        el.scrollLeft = from + (left - from) * eased;
        if (progress < 1) this._carouselFrame = requestAnimationFrame(step);
        else {
          el.scrollLeft = left;
          this._carouselFrame = null;
          this._carouselAnimating = false;
          el.style.scrollSnapType = "";
        }
      };
      this._carouselFrame = requestAnimationFrame(step);
    }
    _enableMouseDrag(el, cards) {
      if (!this._config.carousel_mouse_drag || !el) return;
      let startX = 0, scrollAtStart = 0, dragging = false;
      el.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse" || event.button !== 0 || !cards.length) return;
        startX = event.clientX;
        scrollAtStart = el.scrollLeft;
        dragging = true;
        this._stopCarouselAnimation();
        el.classList.add("is-dragging");
        el.setPointerCapture?.(event.pointerId);
      });
      el.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const delta = event.clientX - startX;
        el.scrollLeft = scrollAtStart - delta;
        if (Math.abs(delta) > 5) event.preventDefault();
      });
      const end = (event) => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove("is-dragging");
        if (el.hasPointerCapture?.(event.pointerId)) el.releasePointerCapture(event.pointerId);
        const first = cards[0];
        if (!first) return;
        const visibleMax = this._carouselMaxIndex(cards.length, el, cards);
        const nearest = cards.reduce((best, card, index) => {
          if (index > visibleMax) return best;
          const distance = Math.abs(el.scrollLeft - (card.offsetLeft - first.offsetLeft));
          return distance < best.distance ? {index, distance} : best;
        }, {index:0, distance:Infinity}).index;
        this._carouselIndex = nearest;
        this._goToCarouselIndex(el, cards, nearest);
        this._armCarouselAutoplay();
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
      el.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          this._scroll(event.key === "ArrowRight" ? 1 : -1);
        }
      });
    }
    _scroll(direction, fromAutoplay=false) {
      // Never cut an animation short if the configured interval fires while a
      // previous transition is still running.
      if (fromAutoplay && this._carouselAnimating) return;
      const el = this.shadowRoot.querySelector(".streams.carousel");
      if (!el) return;
      const cards = [...el.querySelectorAll(".stream")];
      const max = this._carouselMaxIndex(cards.length, el, cards);
      if (max < 1) return;
      const next = this._carouselIndex + (direction > 0 ? 1 : -1);
      this._carouselIndex = next > max ? 0 : next < 0 ? max : next;
      this._goToCarouselIndex(el, cards, this._carouselIndex);
      if (!fromAutoplay) this._armCarouselAutoplay();
    }

    _liveSnapshot(stream, entry) {
      const {progress_ms, ...rest} = stream;
      return JSON.stringify({rest,health:entry?.servers?.find(x => x.server_id === stream.server_id)?.status});
    }
    _refreshHeader(streams) {
      const header = this._header(streams);
      if (header === this._headerMarkup) return;
      const oldHeader = this.shadowRoot.querySelector(".head");
      const root = this.shadowRoot.querySelector(".root");
      if (oldHeader && header) oldHeader.outerHTML = header;
      else if (oldHeader && !header) oldHeader.remove();
      else if (!oldHeader && header) root?.insertAdjacentHTML("afterbegin", header);
      this._headerMarkup = header;
    }
    _updateCarouselLive(entry, streams) {
      const carousel = this.shadowRoot.querySelector(".streams.carousel");
      if (!carousel) return;
      // Keep the carousel element and its scroll animation untouched for routine
      // SSE updates (state, bitrate, codec, server health, posters, etc.).
      this._refreshHeader(streams);
      const cards = [...carousel.querySelectorAll(".stream")];
      for (let index=0; index<streams.length; index++) {
        const stream = streams[index];
        const signature = this._liveSnapshot(stream,entry);
        if (this._liveFingerprints.get(stream.id) === signature) continue;
        const card = cards[index];
        if (!card || card.dataset.session !== String(stream.id)) continue;
        const template = document.createElement("template");
        template.innerHTML = this._streamCard(entry,stream);
        const fresh = template.content?.firstElementChild;
        if (fresh) {
          card.innerHTML = fresh.innerHTML;
          card.style.cssText = fresh.style.cssText;
          this._liveFingerprints.set(stream.id,signature);
        }
      }
    }

    render() {
      const entry = this._entryData();
      const c = this._config;
      if (!this.shadowRoot) return;
      const streams = this._streams(entry);
      // Keep a stable carousel shell while live SSE properties change. The
      // original full DOM rebuild used to teleport the slider without any
      // transition whenever pause/bitrate/health/codec updates arrived.
      const fingerprint = JSON.stringify({
        config: c, language: this._language(),
        streams: c.mode === "carousel" ? streams.map(s => s.id) : streams.map(({progress_ms, ...rest}) => rest),
        stats: c.mode === "carousel" ? undefined : entry?.stats,
        servers: c.mode === "carousel" ? undefined : entry?.servers,
        aliases: entry?.aliases,
        avatars: entry?.avatars,
        connected: entry?.connected,
      });
      // Refresh each stream's clock even if the rest of the card is unchanged.
      // Crucially, do NOT reset its anchor on every incoming SSE progress event.
      const now = this._now();
      for (const stream of streams) this._syncPosition(stream, now);
      if (fingerprint === this._renderFingerprint && this.shadowRoot.querySelector("ha-card")) {
        if (c.mode === "carousel") this._updateCarouselLive(entry, streams);
        this._updateProgress();
        return;
      }
      this._renderFingerprint = fingerprint;
      const carousel = this.shadowRoot.querySelector(".streams.carousel");
      const oldScroll = carousel?.scrollLeft || 0;
      const previousAnchor = carousel?.querySelectorAll(".stream")?.[this._carouselIndex]?.dataset?.session;
      this._stopCarouselAnimation();
      if (c.empty_mode === "hide" && !streams.length) { this.shadowRoot.innerHTML = `<style>${style}</style>`; this.style.display="none"; return; }
      this.style.display="";
      const head = this._header(streams);
      this._headerMarkup = head;
      this._liveFingerprints = new Map(streams.map(s => [s.id, this._liveSnapshot(s,entry)]));
      const visible = clamp(c.carousel_visible, 1, 4, 1);
      const posterScale = clamp(c.poster_size, 50, 200, 100) / 100;
      const posterVars = `--tr-poster-width:${Math.round(73 * posterScale)}px;--tr-poster-height:${Math.round(109 * posterScale)}px;--tr-compact-poster-width:${Math.round(48 * posterScale)}px;--tr-compact-poster-height:${Math.round(72 * posterScale)}px`;
      const items = streams.map(s => this._streamCard(entry,s)).join("");
      // Always conceal the native scrollbar; navigation remains via buttons,
      // touch swipe, optional mouse drag and keyboard arrow keys.
      const classes = `streams ${E(c.mode)}`;
      const emptyText = entry && !entry.connected ? this._t("Tracearr indisponible") : String(c.empty_message ?? this._t("Aucune lecture en cours"));
      const body = !streams.length && c.empty_mode === "header_only" ? "" :
        `<div class="${classes}" ${c.mode === "carousel" ? `tabindex="0" role="region" aria-label="${E(this._t("Lectures en carrousel"))}"` : ""} style="--carousel-visible:${visible}">${items || `<div class="empty-message">${E(emptyText)}</div>`}</div>`;
      const nav = c.mode === "carousel" && c.carousel_show_arrows && streams.length > 1 ? `<div class="carousel-nav"><button class="nav" data-step="-1" aria-label="${E(this._t("Précédent"))}">❮</button><span>${E(this._count(streams.length, "lectures"))}</span><button class="nav" data-step="1" aria-label="${E(this._t("Suivant"))}">❯</button></div>` : "";
      this.shadowRoot.innerHTML = `<style>${style}</style><ha-card style="--tr-font-size:${clamp(c.font_size,10,28,14)}px;${posterVars}"><div class="root ${c.compact?"compact":""} ${c.stream_surface === "transparent" ? "flat-streams" : ""}">${head}${body}${nav}</div></ha-card>`;
      const newCarousel = this.shadowRoot.querySelector(".streams.carousel");
      if (newCarousel) {
        const cards = [...newCarousel.querySelectorAll(".stream")];
        if (previousAnchor) {
          const anchored = streams.findIndex(s => s.id === previousAnchor);
          if (anchored >= 0) this._carouselIndex = anchored;
        }
        this._carouselIndex = Math.min(this._carouselIndex, this._carouselMaxIndex(cards.length, newCarousel, cards));
        if (cards.length) {
          newCarousel.scrollLeft = cards[this._carouselIndex].offsetLeft - cards[0].offsetLeft;
        } else newCarousel.scrollLeft = oldScroll;
        this._enableMouseDrag(newCarousel, cards);
        // A touch swipe is manual navigation too: give the user the entire
        // interval before automatically advancing again.
        newCarousel.addEventListener("touchend", () => this._armCarouselAutoplay(), {passive:true});
        newCarousel.addEventListener("scroll", () => {
          if (this._carouselAnimating || !cards.length) return;
          const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
          if (step > 0) this._carouselIndex = Math.min(this._carouselMaxIndex(cards.length, newCarousel, cards), Math.max(0, Math.round(newCarousel.scrollLeft / step)));
        }, {passive:true});
      } else this._carouselIndex = 0;
      this.shadowRoot.querySelectorAll("button[data-step]").forEach(btn => btn.addEventListener("click", () => this._scroll(Number(btn.dataset.step))));
      this._updateProgress();
    }

  }
  class TracearrStreamsCard extends BaseTracearrCard { get _individual() { return false; } }
  class TracearrStreamCard extends BaseTracearrCard { get _individual() { return true; } }

  const editorStyle = `
    :host { display:block; font:inherit; } .editor { display:grid; gap:9px; padding:8px 0; }
    details { border:1px solid var(--divider-color,#8885); border-radius:10px; overflow:hidden; }
    summary { cursor:pointer; padding:12px; font-size:14px; font-weight:700; background:var(--secondary-background-color,transparent); }
    details[open] summary { border-bottom:1px solid var(--divider-color,#8885); }
    .section-body { padding:12px; display:grid; gap:11px; }
    label { display:grid; gap:5px; font-size:13px; color:var(--primary-text-color); }
    select,input[type=text],input[type=number],textarea,input[type=color] { padding:9px; font:inherit; width:100%; min-width:0; box-sizing:border-box;
      color:var(--primary-text-color); background:var(--card-background-color); border:1px solid var(--divider-color,#777); border-radius:7px; }
    .check { display:flex; align-items:center; gap:8px; } .check input { accent-color:var(--accent-color); flex-shrink:0; }
    .columns { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
    textarea { min-height:64px; resize:vertical; } small { font-size:11px; color:var(--secondary-text-color); }
    .group-label { font-weight:700; font-size:13px; padding-top:5px; }
    .order-list { display:grid; gap:5px; }
    .order-row { display:flex; justify-content:space-between; align-items:center; gap:8px;
      border:1px solid var(--divider-color,#7775); border-radius:7px; padding:4px 6px 4px 10px; font-size:13px; }
    .move-controls { display:flex; gap:4px; }
    .move-controls button { background:var(--secondary-background-color,transparent);
      border:1px solid var(--divider-color,#7775); border-radius:6px; color:var(--primary-text-color);
      cursor:pointer; padding:5px 8px; font:inherit; }
    .move-controls button:disabled { opacity:.3; cursor:default; }
    .badge-row { display:grid; gap:8px; padding:10px; }
    details.subpanel { background:var(--card-background-color); border-radius:8px; }
    details.subpanel summary { padding:10px; font-weight:600; font-size:13px;
      background:transparent; }
    details.subpanel .section-body { gap:9px; }
    .group-label { margin-top:3px; }
    .badge-row ha-entity-picker { display:block; width:100%; }
    .badge-row button,.add-badge { border:1px solid var(--divider-color,#7775);
      border-radius:7px; padding:8px; color:var(--primary-text-color);
      background:var(--secondary-background-color,transparent); cursor:pointer; text-align:left; }
    .range-row { display:flex; gap:12px; align-items:center; }
    .range-row input[type=range] { flex:1; min-width:0; accent-color:var(--accent-color); }
    .range-row output { min-width:50px; text-align:right; font-variant-numeric:tabular-nums; }
  `;
  class TracearrCardEditor extends HTMLElement {
    constructor() {
      super(); this.attachShadow({mode:"open"}); this._config={...DEFAULTS};
      this._payload={entries:[]}; this._openSections=new Set(["global","source"]);
      this._openSubdetails=new Set();
    }
    setConfig(config) {
      // Keep opened categories across dashboard editor rerenders.
      this._captureOpenSections();
      this._config=normalizeConfig(config);
      this.render();
    }
    set hass(hass) {
      const language = this._language();
      this._hass=hass;
      registerCards(languageFor({}, hass));
      if (language !== this._language()) { this._captureOpenSections(); this.render(); }
      this.shadowRoot?.querySelectorAll("ha-entity-picker[data-badge-index]").forEach(p => { p.hass = hass; });
      if (hass?.connection && this._connection !== hass.connection) {
        this._connection=hass.connection;
        hass.connection.sendMessagePromise({type:"tracearr_ha/get"}).then(r=>{
          this._payload=r;this._captureOpenSections();this.render();
        }).catch(()=>{});
      }
    }
    _language() { return languageFor(this._config, this._hass); }
    _t(text) { return translate(this._language(), text); }
    _labels(labels) { return Object.fromEntries(Object.entries(labels).map(([key,value]) => [key,this._t(value)])); }
    _count(count, french="flux") { return this._language() === "fr" ? `${count} ${french}` : `${count} stream${count === 1 ? "" : "s"}`; }
    _captureOpenSections() {
      const details=this.shadowRoot.querySelectorAll("details[data-section]");
      if (details.length) this._openSections=new Set([...details].filter(d=>d.open).map(d=>d.dataset.section));
      const subdetails=this.shadowRoot.querySelectorAll("details[data-subdetail]");
      if (subdetails.length) this._openSubdetails=new Set([...subdetails].filter(d=>d.open).map(d=>d.dataset.subdetail));
    }
    _group(key,title,contents) {
      return `<details data-section="${E(key)}" ${this._openSections.has(key)?"open":""}><summary>${E(title)}</summary><div class="section-body">${contents}</div></details>`;
    }
    _subgroup(key,title,contents) {
      return `<details class="subpanel" data-subdetail="${E(key)}" ${this._openSubdetails.has(key)?"open":""}><summary>${E(title)}</summary><div class="section-body">${contents}</div></details>`;
    }
    _option(value,text) { return `<option value="${E(value)}">${E(text)}</option>`; }
    _select(name,label,options) {
      return `<label>${E(label)}<select data-field="${E(name)}">${options.map(([v,l])=>this._option(v,l)).join("")}</select></label>`;
    }
    _toggle(name,label) {
      return `<label class="check"><input type="checkbox" data-field="${E(name)}" ${this._config[name]?"checked":""}>${E(label)}</label>`;
    }
    _checks(fields) { return `<div class="columns">${fields.map(([key,label])=>this._toggle(key,label)).join("")}</div>`; }
    _number(name,label,min,max) {
      return `<label>${E(label)}<input type="number" min="${min}" max="${max}" step="${Number.isInteger(min) ? 1 : .5}" data-field="${E(name)}" value="${E(this._config[name])}"></label>`;
    }
    _range(name,label,min,max,unit) {
      const value = Math.round(clamp(this._config[name],min,max,min));
      return `<label>${E(label)}<span class="range-row"><input type="range" min="${min}" max="${max}" step="1" data-field="${E(name)}" value="${value}"><output data-range-output="${E(name)}">${value} ${E(unit)}</output></span></label>`;
    }
    _orderEditor(configKey, fields, labels=this._labels(MEDIA_LABELS)) {
      const order = normalizedOrder(this._config[configKey], fields);
      return `<div class="order-list">${order.map((field,index) => {
        const label = labels[field] || field;
        return `<div class="order-row"><span>${E(label)}</span><div class="move-controls"><button type="button" data-order="${E(configKey)}" data-index="${index}" data-direction="-1" ${index===0?"disabled":""} aria-label="${E(this._t("Monter"))} ${E(label)}">↑</button><button type="button" data-order="${E(configKey)}" data-index="${index}" data-direction="1" ${index===order.length-1?"disabled":""} aria-label="${E(this._t("Descendre"))} ${E(label)}">↓</button></div></div>`;
      }).join("")}</div>`;
    }
    _headerOrderEditor() {
      const custom = this._config.header_entity_badges || [];
      const options = [...HEADER_FIELDS, ...custom.map(row => `entity:${row.id}`)];
      const labels = this._labels(HEADER_LABELS);
      custom.forEach(row => { labels[`entity:${row.id}`] = `${E(this._t("Entité"))} : ${row.label || row.entity || this._t("Sans nom")}`; });
      return this._orderEditor("header_badge_order", options, labels);
    }
    _emit() {
      this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:true,composed:true}));
    }
    _alignmentSelect(current,attr) {
      const align = badgeAlign(current);
      return `<label>${E(this._t("Alignement"))}<select ${attr}>
        <option value="auto" ${align==="auto"?"selected":""}>${E(this._t("Automatique (selon le titre)"))}</option>
        <option value="left" ${align==="left"?"selected":""}>${E(this._t("Gauche"))}</option>
        <option value="center" ${align==="center"?"selected":""}>${E(this._t("Centre"))}</option>
        <option value="right" ${align==="right"?"selected":""}>${E(this._t("Droite"))}</option>
      </select></label>`;
    }
    _metricBadgeEditor() {
      const rows = this._config.header_metric_settings || {};
      const checks = this._checks(HEADER_FIELDS.map(key => [`header_show_${key}`, this._t(HEADER_LABELS[key])]));
      return checks + `<small>${E(this._t("Ouvrez une statistique pour régler son alignement et son apparence individuellement. Les options non modifiées suivent le style global."))}</small>` +
        HEADER_FIELDS.map(key => {
          const item = rows[key] || {};
          const content = this._alignmentSelect(item.align,`data-metric-setting="align" data-metric-key="${E(key)}"`) +
            `<label>${E(this._t("Nom personnalisé (facultatif)"))}<input type="text" data-metric-setting="label" data-metric-key="${E(key)}" value="${E(item.label || "")}" placeholder="${E(this._t(HEADER_LABELS[key]))}"></label>`+
            `<div class="columns">` +
              `<label class="check"><input type="checkbox" data-metric-setting="show_name" data-metric-key="${E(key)}" ${(item.show_name ?? this._config.header_show_names) ? "checked" : ""}>${E(this._t("Afficher le nom"))}</label>`+
              `<label class="check"><input type="checkbox" data-metric-setting="show_icon" data-metric-key="${E(key)}" ${item.show_icon ? "checked" : ""}>${E(this._t("Afficher l'icône"))}</label>`+
              `<label class="check"><input type="checkbox" data-metric-setting="only_positive" data-metric-key="${E(key)}" ${item.only_positive ? "checked" : ""}>${E(this._t("Afficher si supérieur à 0"))}</label>`+
              `<label class="check"><input type="checkbox" data-metric-setting="blink_positive" data-metric-key="${E(key)}" ${item.blink_positive ? "checked" : ""}>${E(this._t("Clignoter si supérieur à 0"))}</label>`+
            `</div>`+
            `<label>${E(this._t("Icône MDI (facultatif)"))}<input type="text" data-metric-setting="icon" data-metric-key="${E(key)}" value="${E(item.icon || "")}" placeholder="${E(HEADER_ICONS[key])}"></label>`+
            `<label>${E(this._t("Durée d'un clignotement (secondes)"))}<input type="number" min="0.5" max="20" step="0.5" data-metric-setting="blink_seconds" data-metric-key="${E(key)}" value="${E(item.blink_seconds ?? this._config.header_blink_seconds)}"></label>`+
            `<label>${E(this._t("Couleur si valeur à zéro"))}<select data-metric-setting="zero_color_mode" data-metric-key="${E(key)}"><option value="inherit" ${item.zero_color_mode!=="custom"?"selected":""}>${E(this._t("Réglage global"))}</option><option value="custom" ${item.zero_color_mode==="custom"?"selected":""}>${E(this._t("Couleur particulière"))}</option></select></label>`+
            `<label>${E(this._t("Couleur personnalisée à zéro"))}<input type="color" data-metric-setting="zero_custom_color" data-metric-key="${E(key)}" value="${E(validColor(item.zero_custom_color || "#576574"))}"></label>`;
          return this._subgroup(`metric-${key}`, this._t(HEADER_LABELS[key]), content);
        }).join("");
    }
    _entityBadgeEditor() {
      const rows = this._config.header_entity_badges || [];
      return `<small>${E(this._t("Ajoutez une entité, puis ouvrez sa fiche pour modifier ses options."))}</small>`+
        rows.map((row,index) => this._subgroup(`entity-${row.id}`,
          `${row.label || row.entity || this._t("Nouveau badge")}${row.entity ? ' · '+row.entity : ''}`,
          `<div class="badge-row" data-badge-row="${index}">`+
          `<label>${E(this._t("Entité"))}<ha-entity-picker data-badge-index="${index}" aria-label="${E(this._t("Choisir une entité"))}"></ha-entity-picker></label>`+
          `<label>${E(this._t("Nom facultatif"))}<input type="text" data-badge-label="${index}" placeholder="${E(this._t("Nom de l'entité"))}" value="${E(row.label || "")}"></label>`+
          this._alignmentSelect(row.align,`data-badge-setting="align" data-badge-index="${index}"`)+
          `<div class="columns">`+
            `<label class="check"><input type="checkbox" data-badge-setting="show_name" data-badge-index="${index}" ${(row.show_name ?? this._config.header_show_names) ? "checked" : ""}>${E(this._t("Afficher le nom"))}</label>`+
            `<label class="check"><input type="checkbox" data-badge-setting="show_icon" data-badge-index="${index}" ${row.show_icon ? "checked" : ""}>${E(this._t("Icône de l'entité"))}</label>`+
            `<label class="check"><input type="checkbox" data-badge-setting="only_positive" data-badge-index="${index}" ${row.only_positive ? "checked" : ""}>${E(this._t("Afficher si supérieur à 0"))}</label>`+
            `<label class="check"><input type="checkbox" data-badge-setting="blink_positive" data-badge-index="${index}" ${row.blink_positive ? "checked" : ""}>${E(this._t("Clignoter si supérieur à 0"))}</label>`+
          `</div>`+
          `<label>${E(this._t("Durée d'un clignotement (secondes)"))}<input type="number" min="0.5" max="20" step="0.5" data-badge-setting="blink_seconds" data-badge-index="${index}" value="${E(row.blink_seconds ?? this._config.header_blink_seconds)}"></label>`+
          `<label>${E(this._t("Couleur si valeur à zéro"))}<select data-badge-setting="zero_color_mode" data-badge-index="${index}"><option value="inherit" ${row.zero_color_mode !== "custom" ? "selected" : ""}>${E(this._t("Réglage global"))}</option><option value="custom" ${row.zero_color_mode === "custom" ? "selected" : ""}>${E(this._t("Couleur particulière"))}</option></select></label>`+
          `<label>${E(this._t("Couleur personnalisée à zéro"))}<input type="color" data-badge-setting="zero_custom_color" data-badge-index="${index}" value="${E(validColor(row.zero_custom_color || "#576574"))}"></label>`+
          `<button class="remove-badge" type="button" data-badge-remove="${index}" aria-label="${E(this._t("Supprimer le badge"))}">${E(this._t("Supprimer"))}</button>`+
          `</div>`)).join("")+
        `<button type="button" class="add-badge" data-badge-add ${rows.length>=20?"disabled":""}>${E(this._t("+ Ajouter un badge"))}</button>`;
    }
    render() {
      const c=this._config;
      const entries=this._payload.entries||[];
      const selected=entries.find(e=>e.id===c.entry_id)||entries[0];
      const servers=[...new Map((selected?.servers||[]).map(s=>[s.server_id,[s.server_id,s.server_name]])).values()];
      const users=[...new Set((selected?.streams||[]).map(s=>s.username).filter(Boolean))].sort();
      const isIndividual=c.type==="custom:tracearr-stream-card";
      const streams=selected?.streams||[];
      const accounts=[...new Map(streams.filter(s=>s.username && s.server_id).map(s=>
        [`${s.server_id}:${s.username}`,[`${s.server_id}:${s.username}`,`${s.server_name||s.server_type} · ${s.username}`]])).values()];
      const sessionChoices=[...streams.map(s=>[s.id,`${s.server_name||s.server_type} · ${s.username} — ${s.show_title ? s.show_title + ' / ' : ''}${s.media_title}`])];
      // Keep stored targets selectable even after the session has ended.
      const withSaved=(choices,value,label)=>value && !choices.some(([id])=>String(id)===String(value))
        ? [...choices,[value,label]] : choices;
      const source=this._select("entry_id",this._t("Instance Tracearr"),[["",this._t("Automatique (première instance)")],...entries.map(e=>[e.id,e.name])])+
        (isIndividual ?
          this._select("selection",this._t("Quelle lecture afficher ?"),[
            ["recent",this._t("Dernière lecture active")],["account",this._t("Lecture d'un utilisateur")],
            ["server",this._t("Lecture d'un serveur")],["stream",this._t("Session en cours précise")]])+
          this._select("selected_account",this._t("Utilisateur (continue sur ses prochains films)"),[["",this._t("Choisir un utilisateur")],
            ...withSaved(accounts,c.selected_account,this._t("Utilisateur précédemment choisi"))])+
          this._select("selected_server",this._t("Serveur"),[["",this._t("Choisir un serveur")],
            ...withSaved(servers,c.selected_server,this._t("Serveur précédemment choisi"))])+
          this._select("stream_id",this._t("Session active (disparaît quand elle se termine)"),[["",this._t("Choisir une lecture")],
            ...withSaved(sessionChoices,c.stream_id,this._t("Session précédemment choisie (terminée)"))])+
          `<small>${E(this._t("Choisis une cible ci-dessus ; seuls les champs du mode sélectionné sont utilisés. Pour une carte permanente, privilégie un utilisateur plutôt qu'un ID de session temporaire."))}</small>`
        : "")+
        this._select("filter_server",this._t("Filtrer par serveur"),[["",this._t("Tous les serveurs")],...servers])+
        this._select("filter_user",this._t("Filtrer par utilisateur"),[["",this._t("Tous les utilisateurs")],...users.map(u=>[u,u])])+
        this._select("filter_transcode",this._t("Mode de lecture"),[["all",this._t("Tous")],["direct",this._t("Direct")],["video",this._t("Vidéo seule")],["audio",this._t("Audio seul")],["both",this._t("Vidéo et audio")],["unknown",this._t("Inconnu")]])+
        this._select("sort",this._t("Ordre des flux"),[["recent",this._t("Plus récent d'abord")],["user",this._t("Utilisateur")],["server",this._t("Serveur")]]);
      // Keep the visibility switches, and expose optional per-metric settings below.
      const headerMetrics=this._metricBadgeEditor();
      const headerCommon=this._checks([
        ["header_show_names",this._t("Afficher les noms des statistiques")],
        ["header_positive_only",this._t("Masquer les badges à zéro")],
        ["header_blink_positive",this._t("Clignoter si la valeur est positive")],
      ])+
        this._number("header_blink_seconds",this._t("Période de clignotement (secondes)"),0.5,20)+
        this._select("header_badge_color_mode",this._t("Couleur des badges"),[["inherit",this._t("Palette globale")],["theme",this._t("Thème Home Assistant")],["server",this._t("Couleur du serveur")],["custom",this._t("Personnalisée")]])+
        `<label>${E(this._t("Couleur personnalisée"))}<input type="color" data-field="header_badge_custom_color" value="${E(validColor(c.header_badge_custom_color))}"></label>`+
        this._select("header_zero_color_mode",this._t("Couleur à zéro"),[["normal",this._t("Palette normale")],["custom",this._t("Personnalisée")]])+
        `<label>${E(this._t("Couleur personnalisée à zéro"))}<input type="color" data-field="header_zero_custom_color" value="${E(validColor(c.header_zero_custom_color))}"></label>`;
      const header=this._toggle("show_header",this._t("Afficher l'en-tête"))+
        `<label>${E(this._t("Titre"))}<input type="text" data-field="title" placeholder="${E(this._t("Lectures en cours"))}" value="${E(c.title||"")}"></label>`+
        this._toggle("show_title",this._t("Afficher le titre"))+
        this._subgroup("metrics",this._t("Statistiques Tracearr"),headerMetrics)+
        this._subgroup("entities",this._t("Badges d'entités Home Assistant"),this._entityBadgeEditor())+
        this._subgroup("shared-badges",this._t("Style et comportement communs aux badges"),headerCommon)+
        this._subgroup("badge-order",this._t("Ordre des badges"),this._headerOrderEditor());

      const carousel=this._checks([
          ["carousel_autoplay",this._t("Défilement automatique")],["carousel_show_arrows",this._t("Flèches de navigation")],
          ["carousel_mouse_drag",this._t("Glissement à la souris")],["carousel_pause_on_hover",this._t("Pause au survol")],
        ])+
        `<div class="columns">${this._number("carousel_visible",this._t("Nombre de flux visibles"),1,4)}${this._number("carousel_interval",this._t("Intervalle (secondes)"),3,120)}</div>`+
        this._select("carousel_transition",this._t("Transition"),[["slide",this._t("Glissement")],["fade",this._t("Fondu")],["zoom",this._t("Zoom")],["flip",this._t("Retournement 3D")],["none",this._t("Sans animation")]])+
        this._number("carousel_transition_speed",this._t("Durée de transition (ms)"),100,3000)+
        `<small>${E(this._t("Barre horizontale masquée. Navigation tactile toujours disponible."))}</small>`;
      const media = `<div class="group-label">${E(this._t("Films"))}</div>`+
        this._checks([["movie_show_title",this._t("Afficher le titre")],["movie_show_year",this._t("Afficher l'année")]])+
        `<small>${E(this._t("Ordre d'affichage (flèches pour déplacer les champs, même masqués) :"))}</small>`+
        this._orderEditor("movie_field_order",MOVIE_FIELDS)+
        `<div class="group-label">${E(this._t("Séries et épisodes"))}</div>`+
        this._checks([["series_show_title",this._t("Titre de la série")],["series_show_episode_title",this._t("Nom de l'épisode")],
          ["series_show_season",this._t("Afficher la saison")],["series_show_episode_number",this._t("Afficher le numéro d'épisode")],
          ["series_show_year",this._t("Année de la série")]])+
        this._select("series_episode_style",this._t("Format de saison et épisode"),[["short","S01E02"],["long",this._t("Saison 1 · Épisode 2")]])+
        `<small>${E(this._t("Ordre d'affichage de toutes les informations :"))}</small>`+
        this._orderEditor("series_field_order",SERIES_FIELDS)+
        `<small>${E(this._t("Les réglages d'année sont indépendants entre films et séries."))}</small>`;
      const footer=this._checks([
        ["show_server",this._t("Nom du serveur")],["show_device",this._t("Appareil / lecteur")],
        ["show_quality",this._t("Résolution")],["show_bitrate",this._t("Débit du flux")],
        ["show_codecs",this._t("Codecs")],["show_health",this._t("État du serveur")],
      ])+`<small>${E(this._t("Ordre des informations du bandeau (champs masqués inclus) :"))}</small>`+
        this._orderEditor("footer_field_order", FOOTER_FIELDS, this._labels(FOOTER_LABELS))+
        `<small>${E(this._t("Les badges de résolution et de débit adoptent la palette globale avec une écriture blanche ou noire automatique."))}</small>`;
      const network=this._select("bitrate_scope",this._t("Débits à afficher (sur les flux et dans l'en-tête)"),[
          ["both",this._t("Tous les débits")],["local",this._t("Flux locaux uniquement")],["remote",this._t("Flux distants uniquement")]])+
        `<label>${E(this._t("Exceptions pour cette carte (facultatif, priorité sur les réglages de l’intégration)"))}<textarea data-field="network_locations" placeholder="plex:alice=remote&#10;device:Apple TV=local">${E(c.network_locations||"")}</textarea></label>`+
        `<small>${E(this._t("Les affectations globales se configurent dans Paramètres → Appareils et services → Tracearr HA → Configurer → Localisation des appareils. Ici, vous pouvez ajouter des exceptions : serveur:utilisateur=local/remote, device:Nom=local/remote, player:Nom=local/remote ou utilisateur=local/remote. Les flux sans correspondance restent inconnus et ne sont pas comptés en mode local/distant."))}</small>`;
      const globalDisplay=this._select("language",this._t("Langue"),[["auto",this._t("Automatique (Home Assistant)")],["en","English"],["fr","Français"]])+(isIndividual ? "" :
        this._select("mode",this._t("Disposition"),[["list",this._t("Liste verticale")],["carousel",this._t("Carrousel")]]))+
        this._checks([
        ["compact",this._t("Mode compact")],["show_paused",this._t("Inclure les lectures en pause")],
        ["show_poster",this._t("Affiche")],["show_avatar",this._t("Avatar")],
        ["show_progress",this._t("Progression")],["show_remaining",this._t("Temps restant et pause")],
        ["show_end_time",this._t("Fin de lecture estimée")],["show_transcode_icons",this._t("Icônes vidéo/audio")],
      ])+
        this._select("stream_surface",this._t("Fond intérieur des lectures"),[["soft",this._t("Légèrement contrasté")],["transparent",this._t("Transparent")],["blur",this._t("Affiche floutée (cinéma)")]])+
        `<small>${E(this._t("Le fond cinéma utilise l'affiche du média et reste sombre pour préserver la lisibilité. Sans affiche, le fond reste uni."))}</small>`+
        this._range("stream_blur",this._t("Intensité du flou"),0,50,"px")+
        this._range("stream_overlay",this._t("Assombrissement du fond"),25,95,"%")+
        this._select("stream_accent_style",this._t("Style du liseré gauche"),[["rounded",this._t("Arrondi (suit les coins)")],["straight",this._t("Trait droit (ancien style)")],["none",this._t("Masqué")]])+
        this._range("stream_accent_width",this._t("Épaisseur du liseré"),2,8,"px")+
        this._number("font_size",this._t("Taille du texte (px)"),10,28)+
        this._number("poster_size",this._t("Taille de l'affiche (%)"),50,200)+
        `<small>${E(this._t("100 % correspond à la taille actuelle. Le réglage s'applique aussi au mode compact."))}</small>`+
        this._select("empty_mode",this._t("En l'absence de lecture"),[["message",this._t("Message personnalisé")],["header_only",this._t("En-tête uniquement")],["hide",this._t("Masquer la carte")]])+
        `<label>${E(this._t("Message sans lecture"))}<input type="text" data-field="empty_message" value="${E(c.empty_message??this._t("Aucune lecture en cours"))}"></label>`+
        this._select("accent_color_mode",this._t("Palette globale des couleurs"),[["theme",this._t("Thème Home Assistant")],["server",this._t("Couleur de Plex / Jellyfin / Emby")],["custom",this._t("Personnalisée")]])+
        `<label>${E(this._t("Couleur globale personnalisée"))}<input type="color" data-field="accent_custom_color" value="${E(validColor(c.accent_custom_color))}"></label>`+
        `<small>${E(this._t("La hauteur et la largeur se règlent uniquement dans l'onglet Mise en page de Home Assistant. Les couleurs propres aux badges restent prioritaires sur la palette globale."))}</small>`;
      const usersSection=`<label>${E(this._t("Alias propres à cette carte"))}<textarea data-field="aliases">${E(c.aliases||"")}</textarea></label>`+
        `<label>${E(this._t("Avatars propres à cette carte (URLs HTTPS)"))}<textarea data-field="avatars">${E(c.avatars||"")}</textarea></label>`+
        `<small>${E(this._t("Pour modifier tous les utilisateurs, utilisez la liste dans Paramètres → Appareils et services → Tracearr HA → Configurer."))}</small>`;
      this.shadowRoot.innerHTML=`<style>${editorStyle}</style><div class="editor">${[
        this._group("global",this._t("Affichage général"),globalDisplay),
        this._group("source",this._t("Choix des lectures et filtres"),source),
        ...(!isIndividual ? [this._group("carousel",this._t("Navigation et carrousel"),carousel)] : []),
        this._group("header",this._t("En-tête et badges"),header),
        this._group("media",this._t("Titres, saisons et années"),media),
        this._group("footer",this._t("Bandeau d'informations du flux"),footer),
        this._group("network",this._t("Débit local / distant"),network),
        this._group("users",this._t("Réglages avancés par carte"),usersSection),
      ].join("")}</div>`;
      this.shadowRoot.querySelectorAll("[data-field]").forEach(el => {
        const name=el.dataset.field;
        if (el.tagName==="SELECT") el.value=String(c[name]??"");
        const fn=()=>{
          const value=el.type==="checkbox" ? el.checked :
            (el.type==="number" || el.type==="range") ? Number(el.value) : el.value;
          this._config={...this._config,[name]:value};
          if (name === "language") { this._captureOpenSections(); this.render(); }
          this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:true,composed:true}));
        };
        el.addEventListener("change",fn);
        if (el.type === "range") el.addEventListener("input", () => {
          const output = this.shadowRoot.querySelector(`[data-range-output="${name}"]`);
          if (output) output.textContent = `${el.value} ${name === "stream_overlay" ? "%" : "px"}`;
        });
      });
      // HA's native searchable entity picker; each badge can display any domain.
      this.shadowRoot.querySelectorAll("ha-entity-picker[data-badge-index]").forEach(picker => {
        const index=Number(picker.dataset.badgeIndex);
        picker.hass=this._hass;
        picker.value=c.header_entity_badges?.[index]?.entity || "";
        picker.addEventListener("value-changed", event => {
          event.stopPropagation();
          const rows=[...(this._config.header_entity_badges || [])];
          if (!rows[index]) return;
          rows[index]={...rows[index],entity:String(event.detail?.value || "")};
          this._config={...this._config,header_entity_badges:rows};
          this._emit();
        });
      });
      this.shadowRoot.querySelectorAll("input[data-badge-label]").forEach(input => {
        input.addEventListener("change", () => {
          const rows=[...(this._config.header_entity_badges || [])];
          const index=Number(input.dataset.badgeLabel);
          if (!rows[index]) return;
          rows[index]={...rows[index],label:input.value};
          this._config={...this._config,header_entity_badges:rows};
          this._emit();
        });
      });
      this.shadowRoot.querySelectorAll("[data-metric-setting]").forEach(input => {
        input.addEventListener("change", () => {
          const key = input.dataset.metricKey;
          if (!HEADER_FIELDS.includes(key)) return;
          const field = input.dataset.metricSetting;
          const value = input.type === "checkbox" ? input.checked :
            input.type === "number" ? clamp(input.value,.5,20,2) : input.value;
          const settings = {...(this._config.header_metric_settings || {})};
          settings[key] = {...(settings[key] || {}), [field]:value};
          this._config = {...this._config,header_metric_settings:settings};
          this._emit();
        });
      });
      this.shadowRoot.querySelectorAll("[data-badge-setting]").forEach(input => {
        input.addEventListener("change", () => {
          const rows = [...(this._config.header_entity_badges || [])];
          const index = Number(input.dataset.badgeIndex);
          if (!rows[index]) return;
          const field = input.dataset.badgeSetting;
          const value = input.type === "checkbox" ? input.checked :
            input.type === "number" ? clamp(input.value,.5,20,2) : input.value;
          rows[index] = {...rows[index], [field]: value};
          this._config = {...this._config,header_entity_badges:rows};
          this._emit();
        });
      });
      this.shadowRoot.querySelector("button[data-badge-add]")?.addEventListener("click", () => {
        const rows=[...(this._config.header_entity_badges || [])];
        if (rows.length>=20) return;
        this._captureOpenSections();
        const id = `badge-${Date.now()}-${rows.length}`;
        this._config={...this._config,
          header_entity_badges:[...rows,{id,entity:"",label:""}],
          header_badge_order: `${this._config.header_badge_order || HEADER_FIELDS.join(",")},entity:${id}`};
        this.render(); this._emit();
      });
      this.shadowRoot.querySelectorAll("button[data-badge-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
          const index=Number(btn.dataset.badgeRemove);
          this._captureOpenSections();
          this._config={...this._config,header_entity_badges:this._config.header_entity_badges.filter((_,i)=>i!==index)};
          this.render(); this._emit();
        });
      });
      this.shadowRoot.querySelectorAll("button[data-order]").forEach(btn => btn.addEventListener("click", () => {
        const key=btn.dataset.order;
        const allowed= key==="movie_field_order" ? MOVIE_FIELDS :
          key==="series_field_order" ? SERIES_FIELDS :
          key==="footer_field_order" ? FOOTER_FIELDS :
          [...HEADER_FIELDS, ...(this._config.header_entity_badges || []).map(row => `entity:${row.id}`)];
        const order=normalizedOrder(this._config[key],allowed);
        const index=Number(btn.dataset.index), next=index+Number(btn.dataset.direction);
        if (index<0 || index>=order.length || next<0 || next>=order.length) return;
        [order[index],order[next]]=[order[next],order[index]];
        this._captureOpenSections();
        this._config={...this._config,[key]:order.join(",")};
        this.render();
        this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:true,composed:true}));
      }));
    }
  }
  customElements.define("tracearr-streams-card",TracearrStreamsCard);
  customElements.define("tracearr-stream-card",TracearrStreamCard);
  customElements.define("tracearr-card-editor",TracearrCardEditor);
  // The picker has no per-card configuration; use HA's language when known.
  function registerCards(language) {
    window.customCards=window.customCards||[];
    for (const [type,name,description] of [
      ["tracearr-streams-card","Tracearr – Lectures en cours","Liste ou carrousel des flux Plex, Jellyfin et Emby"],
      ["tracearr-stream-card","Tracearr – Lecture individuelle","Un seul flux Tracearr, à afficher séparément"],
    ]) {
      const localized = {type,name:translate(language,name),description:translate(language,description),preview:false};
      const existing = window.customCards.find(card=>card.type===type);
      if (existing) Object.assign(existing,localized);
      else window.customCards.push(localized);
    }
  }
  registerCards(browserLanguage());
})();
