# CLAUDE.md — DWD Soundboard Project

## Taalgebruik
- Commentaar: Nederlands.
- Variabelen, functies, parameters: Engels (camelCase).
- Constanten: SCREAMING_SNAKE_CASE.

## Technische beperkingen — strikt
- Vanilla HTML, CSS en JavaScript. GEEN frameworks, GEEN libraries, GEEN Bootstrap.
- Alleen technieken uit de JS-cursus: https://rogiervdl.github.io/JS-course/
  Twijfel je over een techniek? Niet gebruiken zonder overleg.
- Data ophalen uitsluitend via de fetch API met async/await syntax.
- DOM-selectie uitsluitend via querySelector() en querySelectorAll().
  Nooit: getElementById, getElementsByClassName, getElementsByTagName.
- Geen var — gebruik const (standaard) of let (alleen als heroewijzing echt nodig is).
- Geen inline event handlers (onclick="...", onchange="..."); altijd addEventListener().
- Geen <style>-tags in HTML; alle stijlen in css/style.css.
- Geen inline style-attributen in HTML.

## Codestijl (volgt de ESLint-config in eslint.config.mjs)
- Inspringing: 3 spaties.
- Strings: enkelvoudige aanhalingstekens ('...').
- Puntkomma's verplicht aan het einde van elke statement.
- const heeft de voorkeur boven let.
- Magic numbers vermijden; gebruik benoemde constanten bovenaan het bestand.
- Maximaal 1 statement per regel.
- Operatoren bij regelafbreking aan het begin van de nieuwe regel.

## Volgorde in elk JavaScript-bestand
1. Importeer/verwijs naar afhankelijkheden (scripts laden via HTML)
2. Constanten en declaraties (const, let)
3. Functies
4. Event handlers (de handler-functies zelf)
5. Event-koppeling (addEventListener-aanroepen)
6. Initialisatie (wat bij opstarten uitgevoerd moet worden)

## Commentaar
- Elke functie krijgt een korte commentaarregel (// Wat doet ze, waarom).
- Niet-voor-de-hand-liggende regels krijgen inline commentaar.
- Externe code (van Stack Overflow, MDN, enz.) krijgt een bronvermelding met link.

## Projectstructuur
```
project/
  index.html          ← enige HTML-pagina
  css/
    style.css         ← alle stijlen
  js/
    config.js         ← API-sleutel constante (nergens anders)
    api.js            ← freesound API-aanroepen (fetch)
    dashboard.js      ← localStorage beheer + dashboard-render
    app.js            ← declaraties, functies, event handlers, initialisatie
```

## Freesound API
- API-sleutel staat **alleen** in js/config.js, nergens anders.
- Zoek-endpoint: https://freesound.org/apiv2/search/text/
- Vereiste velden: id, name, duration, previews, images, username
- Authenticatie: token-parameter in de URL (?token=API_KEY)

## Validatie — alle bestanden moeten slagen
- HTML: html-validate (geen verouderde elementen, geen <style>-tags)
- CSS: stylelint (kleine letters, geen vendor-prefixes, spaties rond calc())
- JS: ESLint (zie eslint.config.mjs in de projectroot)
Commando's (vanuit de projectroot):
  npx html-validate project/index.html
  npx stylelint project/css/style.css
  npx eslint project/js/
