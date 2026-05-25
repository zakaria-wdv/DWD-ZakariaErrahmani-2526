/* ==========================================================================
   api.js — Freesound API-aanroepen
   Alle communicatie met de externe API staat hier centraal.
   Vereist: config.js moet eerder geladen zijn (bevat API_KEY).
   ========================================================================== */

/* global API_KEY */
/* exported searchSounds */

/* --------------------------------------------------------------------------
   Constanten
   -------------------------------------------------------------------------- */

// Basis-URL van de freesound zoek-API
const SEARCH_URL = 'https://freesound.org/apiv2/search/text/';

// Aantal resultaten dat we per zoekopdracht ophalen
const PAGE_SIZE = 10;

// Velden die we van elk geluid nodig hebben
// previews: mp3-URL om af te spelen; images: waveform-afbeelding
const FIELDS = 'id,name,duration,previews,images,username';

/* --------------------------------------------------------------------------
   Functies
   -------------------------------------------------------------------------- */

// Zoekt geluiden op freesound op basis van een trefwoord.
// Geeft een array van geluidobjecten terug, of gooit een fout bij mislukking.
const searchSounds = async(query) => {
   // Bouw de querystring op met URLSearchParams (vermijdt handmatige encodering)
   const params = new URLSearchParams();

   params.append('query', query);
   params.append('token', API_KEY);
   params.append('page_size', PAGE_SIZE);
   params.append('fields', FIELDS);

   const response = await fetch(`${SEARCH_URL}?${params}`);

   // Gooi een leesbare fout als de server een foutcode teruggeeft
   if (!response.ok) {
      throw new Error(`Freesound API-fout (${response.status}): ${response.statusText}`);
   }

   const data = await response.json();

   // data.results is de array met geluidobjecten
   return data.results;
};
