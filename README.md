# Nordic Operations Platform

Genanvendelig arkitektur til Nordic Operations og fremtidige kundeprojekter.
Design, farver og branding fra det eksisterende site
(`johnfinmann-ctrl.github.io/nordic-operations`) er bevaret — det er
**strukturen**, der er ny.

## Princip

Al indhold ligger i `data/*.json`. Al struktur/logik ligger i `css/` og `js/`.
HTML-siderne i `pages/` er tynde skabeloner, der henter data og renderer dem —
de indeholder ikke fast tekst, som ellers skulle rettes flere steder.

```
├── css/            Fælles designsystem (core, responsive, admin)
├── js/             app.js (bootstrap), nav.js, footer.js, products.js, auth.js, admin.js
├── data/           config.json, products.json, cases.json, news.json — ALT indhold
├── pages/           Undersider (løsninger, produkter, cases, kontakt, ...)
├── admin/          Login + dashboard-skal (CMS-arkitektur, klar til backend)
├── assets/         Billeder, ikoner
├── index.html      Forside (kort — henviser videre til pages/)
└── manifest.json   PWA-manifest
```

## Sådan genbruges platformen til en ny kunde

1. Kopiér hele mappen til et nyt projekt.
2. Ret **kun** `data/config.json` (branding, farver, menu, kontakt) og
   `data/products.json` / `cases.json` / `news.json` (indhold).
3. Udskift `assets/img/logo.svg` og `assets/icons/favicon.svg`.
4. Rør ikke `css/core.css`, `js/nav.js`, `js/footer.js` eller
   sideskabelonerne i `pages/` — de er arkitekturen, ikke kundeindholdet.

Farver kan overrides pr. kunde ved at ændre CSS-variablerne øverst i
`css/core.css`, eller — hvis flere kunder skal dele samme kodebase —
ved at flytte token-blokken ud i en lille `theme.css` pr. kunde, der
indlæses efter `core.css`. Ikke gjort i dette skelet, men arkitekturen
understøtter det uden ombygning.

## Sti-opløsning (`data-root`)

Hver side sætter `<html data-root="./">` (roden) eller `<html data-root="../">`
(`pages/`, `admin/`). `app.js` læser dette til at bygge korrekte stier til
`data/`, `css/`, `js/` og `assets/` — uanset om platformen ligger i
domænets rod eller i en undermappe (fx GitHub Pages-projektsider:
`/nordic-operations/`).

## Status i dette skelet

- ✅ Forside, 5 løsnings-/kategorisider, produktoversigt + generisk
  produktdetalje-skabelon, cases, drift-sikkerhed-landing,
  brancheløsninger, om os, kontakt
- ✅ Admin-login + dashboard-skal (læser reelle data, redigering endnu
  ikke skrevet tilbage — kræver backend, se note i `admin/dashboard.html`)
- ✅ PWA-manifest
- ✅ Priser: hvert produkt i `products.json` har et `pricing`-felt
  (`model`, `priceLabel`, `priceFrom`, `billingNote`). Alle produkter
  starter som `"Kontakt for pris"` — der er IKKE gættet konkrete beløb
  på jeres vegne. Ret `priceFrom` (fx `"2.500 kr./md."`) pr. produkt,
  når I har de rigtige tal klar.
- ✅ SEO: `sitemap.xml` (27 URL'er, genereret fra `products.json` +
  statiske sider) og `robots.txt` (blokerer `/admin/`, peger på
  sitemap). Opdatér `sitemap.xml` ved at køre generator-scriptet igen,
  når I tilføjer nye produkter/sider — eller bed om at få det kørt.
- ✅ Arkitekturplan for booking & betaling:
  `docs/booking-betaling-arkitektur.md` — beskriver faseplan,
  datamodel og de beslutninger, I skal tage, før det bygges. Ikke
  implementeret endnu.
- ⏳ Stadig ikke lavet: rigtige PNG-ikoner (kun placeholder-SVG),
  skarpe produktbilleder/screenshots, reelt gem-endpoint til admin,
  medlemsløsningens database/login-backend, selve
  booking/betaling-modulet

## Vigtig sikkerhedsnote

`js/auth.js` er en **front-end demo-gate** (kommenteret tydeligt i
filen). Den forhindrer ikke direkte adgang til `/admin/`-siderne for en
teknisk bruger. Den findes for at etablere UI-mønsteret. Skal ALDRIG
bruges til sider med rigtige medlems- eller betalingsdata uden en reel
backend bagved — se `pages/medlemsloesning.html` for kravene til det.
