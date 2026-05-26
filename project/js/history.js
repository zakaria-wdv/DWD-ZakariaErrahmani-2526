/* ==========================================================================
   history.js — Zoekgeschiedenis: opslaan in en laden vanuit localStorage
   Volgorde: declaraties → functies → (event handlers in app.js)
   ========================================================================== */

/* exported addToHistory, loadHistory, clearHistory */

/* --------------------------------------------------------------------------
   Constanten
   -------------------------------------------------------------------------- */

// Sleutel waaronder de geschiedenis in localStorage wordt opgeslagen
const HISTORY_KEY = 'soundboard-history';

// Maximaal aantal zoektermen dat bewaard wordt
const HISTORY_MAX = 10;

/* --------------------------------------------------------------------------
   DOM-referenties
   -------------------------------------------------------------------------- */

const historyList = document.querySelector('#history-list');
const historyClearBtn = document.querySelector('#history-clear-btn');

/* --------------------------------------------------------------------------
   Functies
   -------------------------------------------------------------------------- */

// Leest de opgeslagen zoektermen uit localStorage.
// Geeft een lege array terug als er nog niets opgeslagen is.
const getHistory = () => {
   const stored = localStorage.getItem(HISTORY_KEY);
   return stored ? JSON.parse(stored) : [];
};

// Schrijft een array van zoektermen naar localStorage als JSON-tekst.
const saveHistory = (items) => {
   localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
};

// Vult de geschiedenis-lijst met klikbare zoektermen als <li>-knoppen.
const renderHistory = (items) => {
   // Verberg de knop als de geschiedenis leeg is
   historyClearBtn.style.display = items.length === 0 ? 'none' : '';

   historyList.innerHTML = items
      .map((term) => `<li><button class="history-item" type="button">${term}</button></li>`)
      .join('');
};

// Voegt een zoekterm toe aan de geschiedenis (meest recent bovenaan, max 10, geen duplicaten).
const addToHistory = (query) => {
   // Verwijder het woord als het er al in staat (zodat het straks bovenaan komt)
   const items = getHistory().filter((term) => term !== query);

   // Voeg bovenaan in en knip af op het maximum
   items.unshift(query);
   const trimmed = items.slice(0, HISTORY_MAX);

   saveHistory(trimmed);
   renderHistory(trimmed);
};

// Wist de volledige zoekgeschiedenis uit localStorage en de UI.
const clearHistory = () => {
   saveHistory([]);
   renderHistory([]);
};

// Laadt en toont de opgeslagen geschiedenis bij het opstarten van de app.
const loadHistory = () => {
   renderHistory(getHistory());
};
