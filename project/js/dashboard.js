/* ==========================================================================
   dashboard.js — Dashboard: opslaan in en laden vanuit localStorage
   Volgorde: declaraties → functies → (geen eigen event handlers; app.js beheert die)
   ========================================================================== */

/* exported saveToDashboard, loadDashboard, removeFromDashboard */

/* --------------------------------------------------------------------------
   Constanten
   -------------------------------------------------------------------------- */

// Sleutel waaronder het dashboard in localStorage wordt opgeslagen
const DASHBOARD_KEY = 'soundboard-dashboard';

// Grens voor voorloopnul bij seconden — identiek aan DURATION_PADDING in app.js
const DASHBOARD_DURATION_PADDING = 10;

// Seconden per minuut — identiek aan SECONDS_PER_MINUTE in app.js
const DASHBOARD_SECONDS_PER_MINUTE = 60;

/* --------------------------------------------------------------------------
   DOM-referenties
   -------------------------------------------------------------------------- */

// Gedeclareerd hier (niet in app.js) om een globaal naamconflict te vermijden
const dashboardList = document.querySelector('#dashboard-list');
const dashboardEmptyMsg = document.querySelector('#dashboard-empty');

/* --------------------------------------------------------------------------
   Functies
   -------------------------------------------------------------------------- */

// Zet een duur in seconden om naar leesbaar formaat (bijv. 63.4 → "1:03").
// Gedupliceerd vanuit app.js om een cross-file afhankelijkheid te vermijden.
const formatDashboardDuration = (seconds) => {
   const mins = Math.floor(seconds / DASHBOARD_SECONDS_PER_MINUTE);
   const secs = Math.floor(seconds % DASHBOARD_SECONDS_PER_MINUTE);
   const paddedSecs = secs < DASHBOARD_DURATION_PADDING ? `0${secs}` : `${secs}`;

   return `${mins}:${paddedSecs}`;
};

// Leest de opgeslagen geluiden uit localStorage.
// Geeft een lege array terug als er nog niets opgeslagen is.
const getSounds = () => {
   const stored = localStorage.getItem(DASHBOARD_KEY);

   // JSON.parse zet de opgeslagen tekst terug naar een JavaScript-array
   return stored ? JSON.parse(stored) : [];
};

// Schrijft een array van geluiden naar localStorage als JSON-tekst.
const saveSounds = (sounds) => {
   localStorage.setItem(DASHBOARD_KEY, JSON.stringify(sounds));
};

// Bouwt de HTML-string voor één dashboard-kaart.
// Zelfde structuur als een zoekresultaatkaart, maar met ✕ in plaats van ☆.
const renderDashboardCard = (sound) => {
   // duration is opgeslagen als string; parseFloat maakt er een getal van
   const duration = formatDashboardDuration(parseFloat(sound.duration));

   return `<li class="sound-card"
         data-id="${sound.id}"
         data-name="${sound.name}"
         data-preview-url="${sound.previewUrl}"
         data-waveform="${sound.waveform}"
         data-username="${sound.username}"
         data-duration="${sound.duration}">
      <button class="play-btn" type="button">
         <img class="waveform-img" src="${sound.waveform}" alt="Waveform van ${sound.name}">
         <span class="sound-info">
            <span class="sound-name">${sound.name}</span>
            <span class="sound-meta">${duration} &middot; ${sound.username}</span>
         </span>
      </button>
      <button class="icon-btn icon-btn--remove" type="button" aria-label="Verwijder ${sound.name}">&#10005;</button>
   </li>`;
};

// Vult de dashboard-lijst met de opgeslagen geluiden en beheert het leeg-bericht.
const renderDashboard = (sounds) => {
   dashboardList.innerHTML = sounds.map(renderDashboardCard).join('');

   // Toon of verberg het "nog geen geluiden"-bericht op basis van de lijstlengte
   if (sounds.length === 0) {
      dashboardEmptyMsg.classList.remove('is-hidden');
   } else {
      dashboardEmptyMsg.classList.add('is-hidden');
   }
};

// Voegt een geluid toe aan het dashboard.
// Doet niets als het geluid er al in staat (geen duplicaten).
const saveToDashboard = (sound) => {
   const sounds = getSounds();

   // Zoek of dit geluid al bestaat op basis van zijn unieke id
   if (sounds.find((s) => s.id === sound.id)) {
      return;
   }

   sounds.push(sound);
   saveSounds(sounds);
   renderDashboard(sounds);
};

// Verwijdert een geluid uit het dashboard op basis van zijn id.
const removeFromDashboard = (id) => {
   // filter() maakt een nieuwe array zonder het te verwijderen geluid
   const sounds = getSounds().filter((s) => s.id !== id);

   saveSounds(sounds);
   renderDashboard(sounds);
};

// Laadt en toont de opgeslagen dashboard-knoppen bij het opstarten van de app.
const loadDashboard = () => {
   renderDashboard(getSounds());
};
