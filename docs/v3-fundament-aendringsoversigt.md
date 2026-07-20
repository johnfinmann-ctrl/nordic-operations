# v3.0 Fundament — Ændringsoversigt

Denne runde tilføjede kun de dele af "Master Platform"-visionen, der IKKE
kræver en aktiv Supabase-konto. Intet nedenfor rører booking, betaling
eller medlemsdata — det afventer bevidst jeres beslutninger (se
`docs/booking-betaling-arkitektur.md`).

## Nye mapper

- `api/` — adapterlag mellem sider og datakilde
- `components/` — selvstændige, genbrugelige UI-komponenter
- `.github/workflows/` — CI/validering + valgfri deploy
- `docs/` — udvidet med denne fil og Supabase-planen

## Nye filer

| Fil | Formål | Status |
|---|---|---|
| `api/supabase.config.js` | Konfigurations-placeholder for Supabase | Ikke aktiv (`active: false`), ingen rigtige nøgler |
| `api/data-source.js` | Adapterlag — al datahentning går herigennem | ✅ Fungerer nu (læser JSON). Klar til Supabase-udskiftning uden at røre andre filer |
| `components/install-prompt.js` | PWA install-banner | ✅ Fungerer nu |
| `service-worker.js` | Offline-cache af app-skal + data | ✅ Fungerer nu |
| `admin/qr.html` | QR-kodegenerator (produkt/kontakt/event/download/formular) | ✅ Fungerer nu, ingen backend nødvendig |
| `.github/workflows/validate.yml` | Validerer JSON ved hver push | ✅ Aktiv, kan ikke påvirke Pages-deployment |
| `.github/workflows/deploy.yml` | Alternativ Pages-deploy | ⏸ Kun manuel (`workflow_dispatch`), rører ikke jeres nuværende opsætning medmindre I aktivt skifter Pages-kilde |
| `.nojekyll` | Forhindrer GitHub Pages i at Jekyll-processere filerne | ✅ Aktiv — forebygger en almindelig årsag til "mystiske" Pages-fejl |
| `docs/supabase-migration-plan.md` | Hvad aktiveres hvornår, sikkerhedsregler | Reference-dokument |

## Ændrede filer

- **`js/app.js`** — henter nu data via `NordicDataSource` (adapterlag) i
  stedet for at fetch'e JSON direkte. Tilføjet: canonical-link,
  Open Graph, Twitter Cards, JSON-LD Organization-schema, service
  worker-registrering (med eksplicit `scope` for korrekt virkemåde under
  en GitHub Pages-undermappe).
- **`js/auth.js`** — tilføjet formel rollestruktur: `SUPERADMIN`, `ADMIN`,
  `REDAKTOR`, hver med en `permissions`-liste. `login()` tager nu en
  rolle som parameter. **Stadig kun en front-end demo-gate** — håndhæves
  ikke sikkert, se advarsler i filen og i `admin/index.html`.
- **`js/products.js`** — produktsiden sætter nu egen meta description,
  canonical og JSON-LD Product-schema pr. produkt.
- **`admin/index.html`** — login har nu et rolle-dropdown (demo) og en
  tydelig advarsel om, at dette ikke er produktionssikkert.
- **`admin/dashboard.html`** — viser aktiv rolle, advarselsboks øverst,
  "Brugerroller"-linket er skjult, medmindre rollen har
  `manage_roles`-rettigheden (demonstrerer mønsteret — håndhæves reelt
  først med Supabase RLS).
- **Alle 16 HTML-sider** — fik indsat `<script>`-tags for
  `api/supabase.config.js` og `api/data-source.js` før `js/app.js`.
  Offentlige sider (ikke admin) fik desuden `components/install-prompt.js`.

## Hvad der IKKE er lavet (bevidst, afventer jeres input)

- Booking, kalender, betaling, kontingent — se separat arkitekturplan
- Faktisk Supabase-forbindelse — kræver et rigtigt projekt (se
  `docs/supabase-migration-plan.md`)
- Rigtige PNG-app-ikoner (kun placeholder-SVG) — manifest peger på
  `icon-192.png`/`icon-512.png`, som endnu ikke eksisterer
- Lighthouse-måling — bør køres, når sitet er deployet til en rigtig
  GitHub Pages-URL (kan ikke måles retvisende fra en lokal testserver)

## Testresultater (kørt før pakning)

1. **JSON-validering** — alle `data/*.json` + `manifest.json`: ✅ gyldige
2. **YAML-validering** — begge GitHub Actions-workflows: ✅ gyldig syntaks
3. **JS-syntakstjek** (`node --check`) — alle 10 JS-filer i
   `js/`, `api/`, `components/` samt `service-worker.js`: ✅ ingen fejl
4. **HTTP-statustjek** — alle 16 HTML-sider + `sitemap.xml`, `robots.txt`,
   `manifest.json`, `service-worker.js`, `.nojekyll` via lokal server:
   ✅ alle svarer 200
5. **Referencetjek** — 161 interne `src`/`href`-referencer på tværs af
   alle sider: ✅ ingen reelt brudte links (3 falske positiver fra
   regex, der matchede JS-strenge i inline scripts — verificeret manuelt)

**Ikke testet i dette miljø** (kræver rigtig browser/GitHub Pages):
faktisk service worker-installation, PWA-installérbarhed, faktisk
Lighthouse-score. Anbefaling: test disse tre efter push til GitHub Pages,
før I går videre til næste sprint.
