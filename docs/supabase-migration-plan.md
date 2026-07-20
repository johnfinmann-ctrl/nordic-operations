# Supabase-aktiveringsplan

Status: **plan, ikke aktiveret.** `api/supabase.config.js` har `active: false`,
og ingen kode kalder Supabase endnu. Dette dokument beskriver præcis, hvad
der sker, når I er klar — så det ikke kræver gætværk senere.

## Hvad der virker i dag UDEN Supabase

- Alt offentligt indhold (produkter, cases, nyheder, priser) — læses fra
  `data/*.json` via `api/data-source.js`.
- SEO (canonical, Open Graph, Twitter Cards, JSON-LD/Schema.org).
- PWA (manifest, service worker, install-prompt).
- QR-kodegenerator i admin (`admin/qr.html`) — bruger en offentlig
  QR-tjeneste, ingen nøgler nødvendige.
- Admin-login og rollestruktur (Superadmin/Admin/Redaktør) — men **kun som
  demo i browseren**. Se advarslen nederst.

## Hvad der FØRST aktiveres, når Supabase kobles til

| Funktion | I dag | Med Supabase |
|---|---|---|
| Login | Demo-adgangskode i `sessionStorage` | Supabase Auth (e-mail/password eller magic link), reelt sikkert |
| Roller | Statisk liste i `js/auth.js`, ikke håndhævet | Roller gemt i databasen, håndhævet af Row Level Security (RLS) — en Redaktør kan fysisk ikke hente data, de ikke må se, uanset hvad frontend-koden gør |
| Admin-redigering | Read-only visning af JSON-data | Rigtige skrive-kald, der opdaterer databasen med det samme |
| Billeder/filer | Statiske filer i `assets/` | Supabase Storage — upload direkte fra admin |
| Ændringshistorik | Ingen | Audit log — hvem ændrede hvad, hvornår |
| Backup | Manuel (Git-historik) | Automatisk databasebackup via Supabase |

## Aktiveringstrin (når I er klar)

1. Opret Supabase-projekt.
2. Udfyld `url` og `anonKey` i `api/supabase.config.js`, sæt `active: true`.
   **Kun** anon/public key — aldrig service_role.
3. Opret tabellerne `products`, `cases`, `news` (samme feltnavne som i de
   nuværende JSON-filer, så overgangen er 1:1).
4. Udfyld de `if (cfg.active) { ... }`-grene i `api/data-source.js` med
   rigtige Supabase-kald. Alt andet i platformen (pages/, components/)
   ændres ikke — det er netop pointen med adapterlaget.
5. Slå Row Level Security til på alle tabeller, og skriv policies der
   matcher rollerne i `js/auth.js` (Superadmin/Admin/Redaktør).
6. Erstat `js/auth.js`'s demo-login med Supabase Auth.

## Sikkerhedsregler, der IKKE må brydes ved aktivering

- Service Role Key må **aldrig** committes til Git eller ligge i nogen
  fil under `css/`, `js/`, `pages/`, `admin/` eller `api/`. Den bruges
  udelukkende server-side (fx i en Supabase Edge Function eller en
  GitHub Actions "secret" til automatiserede opgaver).
- Alt der rører ved medlems- eller betalingsdata (se
  `docs/booking-betaling-arkitektur.md`) skal have RLS slået til, før
  det går i produktion — ikke bagefter.

## Advarsel, indtil da

Dagens admin-login (`admin/index.html`) er en **front-end demo-gate**.
Den er nyttig til at vise UI-flowet og rollestrukturen, men forhindrer
ikke en teknisk bruger i at tilgå `/admin/`-siderne direkte. Brug den
aldrig til rigtige kunde- eller medlemsdata, før trin 1-6 herover er
gennemført.
