/* ==========================================================================
   app.js — Hoofdlogica van de soundboard-applicatie
   Volgorde: declaraties → functies → event handlers → events koppelen → init
   ========================================================================== */

/* global searchSounds, saveToDashboard, loadDashboard, removeFromDashboard, dashboardList */

/* --------------------------------------------------------------------------
   Constanten
   -------------------------------------------------------------------------- */

// Grens waaronder seconden een voorloopnul krijgen (bijv. 1:05 in plaats van 1:5)
const DURATION_PADDING = 10;

// Aantal seconden in één minuut, gebruikt bij het omzetten van de duur
const SECONDS_PER_MINUTE = 60;

/* --------------------------------------------------------------------------
   DOM-referenties — alle elementen die JS nodig heeft staan hier bijeen
   -------------------------------------------------------------------------- */

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const searchStatus = document.querySelector('#search-status');
const resultsList = document.querySelector('#results');
const volumeSlider = document.querySelector('#volume');

/* --------------------------------------------------------------------------
   Toestand — variabelen die de huidige staat van de app bijhouden
   -------------------------------------------------------------------------- */

// Het gedeelde Audio-object; slechts één geluid speelt tegelijkertijd
const audio = new Audio();

// De .play-btn die momenteel actief is (null = niets speelt)
let activeButton = null;

/* --------------------------------------------------------------------------
   Functies
   -------------------------------------------------------------------------- */

// Toont een statusbericht in het zoekpaneel.
// isError=true geeft het bericht een rode kleur via de CSS-klasse.
const setStatus = (message, isError) => {
   searchStatus.textContent = message;

   if (isError) {
      searchStatus.classList.add('status-message--error');
   } else {
      searchStatus.classList.remove('status-message--error');
   }
};

// Zet een duur in seconden om naar leesbaar formaat (bijv. 63.4 → "1:03").
const formatDuration = (seconds) => {
   const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
   const secs = Math.floor(seconds % SECONDS_PER_MINUTE);

   // Voeg een voorloopnul toe als de seconden onder de 10 zijn
   const paddedSecs = secs < DURATION_PADDING ? `0${secs}` : `${secs}`;

   return `${mins}:${paddedSecs}`;
};

// Bouwt de HTML-string voor één zoekresultaatkaart op basis van een API-geluidobject.
// Data-attributen op de <li> slaan alle info op zodat click handlers ze kunnen uitlezen.
// Noot: de freesound API-data is vertrouwd; in productie zou je strings escapen.
const renderSoundCard = (sound) => {
   // Gebruik de hoge kwaliteit mp3-preview; val terug op lage kwaliteit indien nodig
   const previewUrl = sound.previews['preview-hq-mp3'] || sound.previews['preview-lq-mp3'];
   const waveformUrl = sound.images.waveform_m || sound.images.waveform_l;
   const duration = formatDuration(sound.duration);

   return `<li class="sound-card"
         data-id="${sound.id}"
         data-name="${sound.name}"
         data-preview-url="${previewUrl}"
         data-waveform="${waveformUrl}"
         data-username="${sound.username}"
         data-duration="${sound.duration}">
      <button class="play-btn" type="button">
         <img class="waveform-img" src="${waveformUrl}" alt="Waveform van ${sound.name}">
         <span class="sound-info">
            <span class="sound-name">${sound.name}</span>
            <span class="sound-meta">${duration} &middot; ${sound.username}</span>
         </span>
      </button>
      <button class="icon-btn icon-btn--fav" type="button" aria-label="Voeg toe aan dashboard">&#9734;</button>
   </li>`;
};

// Vult de resultatenlijst met zoekresultaten als HTML-kaarten.
const renderResults = (sounds) => {
   // map() zet elk geluidobject om naar een HTML-string; join('') plakt ze samen
   resultsList.innerHTML = sounds.map(renderSoundCard).join('');
};

// Speelt het geluid van de gegeven .play-btn af, of stopt het als het al speelt.
// Wordt gebruikt door zowel de resultatenlijst als het dashboard.
const togglePlay = (playBtn) => {
   const card = playBtn.parentNode;

   // Zelfde knop nogmaals geklikt → geluid stoppen
   if (activeButton === playBtn) {
      audio.pause();
      card.classList.remove('is-playing');
      activeButton = null;
      return;
   }

   // Ander geluid was actief → stop het eerst en verwijder de visuele aanduiding
   if (activeButton) {
      audio.pause();
      activeButton.parentNode.classList.remove('is-playing');
   }

   // Laad en speel het nieuwe geluid af
   // audio.play() geeft een Promise terug; fouten (bijv. autoplay-beleid)
   // zijn hier niet afgevangen om het gebruik van .catch() te vermijden (niet in cursus).
   audio.src = card.dataset.previewUrl;
   audio.play();

   // Markeer de kaart als actief (groene rand en kleur via CSS)
   card.classList.add('is-playing');
   activeButton = playBtn;
};

/* --------------------------------------------------------------------------
   Event handlers
   -------------------------------------------------------------------------- */

// Verwerkt het insturen van het zoekformulier: bevraagt de API en toont resultaten.
const handleSearch = async(e) => {
   e.preventDefault();

   const query = searchInput.value.trim();

   // Doe niets als het zoekveld leeg is
   if (!query) {
      setStatus('Vul een zoekterm in.');
      return;
   }

   // Stop het geluid als het uit de resultatenlijst speelt (die gaat geleegd worden).
   // contains() controleert of activeButton een afstammeling is van resultsList.
   if (activeButton && resultsList.contains(activeButton)) {
      audio.pause();
      activeButton.parentNode.classList.remove('is-playing');
      activeButton = null;
   }

   // Toon laadmelding en blokkeer de knop om dubbel zoeken te voorkomen
   setStatus('Bezig met zoeken...');
   searchButton.disabled = true;
   resultsList.innerHTML = '';

   try {
      const sounds = await searchSounds(query);

      if (sounds.length === 0) {
         setStatus('Geen resultaten gevonden. Probeer een andere zoekterm.');
      } else {
         setStatus('');
         renderResults(sounds);
      }
   } catch (error) {
      setStatus(`Fout bij ophalen: ${error.message}`, true);
   } finally {
      // Herstel de zoekknop altijd, ook bij een fout
      searchButton.disabled = false;
   }
};

// Verwerkt alle klikken in de resultatenlijst via event delegation.
// .play-btn kinderen hebben pointer-events:none (CSS), dus e.target is altijd de knop zelf.
const handleResultsClick = (e) => {
   // Klik op het favoriet-icoon (☆) → geluid toevoegen aan het dashboard
   if (e.target.classList.contains('icon-btn--fav')) {
      const card = e.target.parentNode;

      // Haal de geluiddata op uit de data-attributen van de kaart-<li>
      saveToDashboard({
         id: card.dataset.id,
         name: card.dataset.name,
         previewUrl: card.dataset.previewUrl,
         waveform: card.dataset.waveform,
         username: card.dataset.username,
         duration: card.dataset.duration,
      });

      return;
   }

   // Klik op de afspeelknop → geluid afspelen of stoppen
   if (e.target.classList.contains('play-btn')) {
      togglePlay(e.target);
   }
};

// Verwerkt alle klikken op het dashboard via event delegation.
const handleDashboardClick = (e) => {
   // Klik op de verwijderknop (✕) → geluid van het dashboard verwijderen
   if (e.target.classList.contains('icon-btn--remove')) {
      const card = e.target.parentNode;

      // Stop het geluid als juist dit dashboard-item aan het spelen is
      if (activeButton && activeButton.parentNode === card) {
         audio.pause();
         activeButton = null;
      }

      removeFromDashboard(card.dataset.id);
      return;
   }

   // Klik op de afspeelknop → geluid afspelen of stoppen
   if (e.target.classList.contains('play-btn')) {
      togglePlay(e.target);
   }
};

// Stelt het volume van het Audio-object in op de waarde van de slider.
const handleVolumeChange = () => {
   // parseFloat zet de string-waarde van de slider om naar een getal (0.0 – 1.0)
   audio.volume = parseFloat(volumeSlider.value);
};

// Wordt aangeroepen als een geluid vanzelf stopt (einde bereikt).
// Verwijdert de visuele aanduiding van de actieve knop.
const handleAudioEnded = () => {
   if (activeButton) {
      activeButton.parentNode.classList.remove('is-playing');
   }

   // Reset zodat de volgende klik het geluid opnieuw kan afspelen
   activeButton = null;
};

/* --------------------------------------------------------------------------
   Events koppelen
   -------------------------------------------------------------------------- */

searchForm.addEventListener('submit', handleSearch);

// Eén listener op de volledige lijst vangt alle klikken op (event delegation)
resultsList.addEventListener('click', handleResultsClick);

// Zelfde patroon voor het dashboard: spelen en verwijderen via één listener
dashboardList.addEventListener('click', handleDashboardClick);

// Volumeslider: 'input' vuurt bij elke beweging, niet pas bij loslaten
volumeSlider.addEventListener('input', handleVolumeChange);

// Verwijder de actieve staat als een geluid vanzelf afloopt
audio.addEventListener('ended', handleAudioEnded);

/* --------------------------------------------------------------------------
   Initialisatie
   -------------------------------------------------------------------------- */

// Laad opgeslagen dashboard-knoppen vanuit localStorage bij het opstarten van de app
loadDashboard();
