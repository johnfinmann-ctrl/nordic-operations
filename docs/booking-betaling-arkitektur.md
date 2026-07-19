# Arkitekturplan: Booking & Betaling-modul

Status: **plan, ikke bygget.** Dette dokument beskriver, hvordan booking og
online betaling tilføjes til platformen, når en kunde (typisk en
medlemsløsning eller golfklub) har brug for det — uden at det kræver en
ombygning af det eksisterende skelet.

## Hvorfor det ikke er en "kopiér config"-opgave

Booking og betaling er de første to funktioner i platformen, der
**skal** have en rigtig backend og en rigtig database. Alt andet i
skelettet (indhold, branding, produktsider) er statisk data i JSON, som
kan læses direkte af browseren. Booking og betaling kræver derimod:

- Data der ændrer sig i realtid og skal være **konsistent** på tværs af
  brugere (to personer må ikke booke samme tid).
- Hemmeligheder (betalings-API-nøgler), som **aldrig** må ligge i
  frontend-kode eller en JSON-fil, der hentes af browseren.
- Et sted at validere, at en betaling faktisk er gennemført, før en
  booking bekræftes — det kan ikke ske i browseren alene.

## Foreslået arkitektur

```
Frontend (eksisterende platform)
   │
   │  fetch/POST til et lille API-lag
   ▼
API-lag (nyt, minimalt)
   │
   ├── Bookinglogik (ledige tider, konflikthåndtering)
   ├── Betalingsintegration (fx MobilePay, Stripe eller Nets)
   └── Database (medlemmer, bookinger, ordrer, betalingsstatus)
```

**Anbefalet teknisk retning:** en let, serverless backend (fx et par
funktioner på Netlify Functions, Vercel eller Cloudflare Workers) frem
for en tung, selvhostet server. Det passer bedst til jeres nuværende
GitHub Pages / Netlify-arbejdsgang og kræver ikke, at I drifter en
server 24/7.

## Nye datamodeller (udvidelse af nuværende `data/`-mønster)

Disse ligger **ikke** som statiske JSON-filer som i dag, men i en rigtig
database (fx en letvægts-hosted database som Supabase eller Turso),
fordi de ændrer sig i realtid:

- `bookings`: id, produkt/klub-id, tidspunkt, kunde-id, status
  (afventer/bekræftet/betalt/annulleret)
- `payments`: id, booking-id, beløb, betalingsudbyder, status,
  transaktions-reference
- `members`: id, navn, e-mail, medlemsstatus, kontingent-status
  (kobler direkte til medlemsløsningens krav fra `pages/medlemsloesning.html`)

## Faseplan

1. **Fase 1 — Booking uden betaling.** Et simpelt bookingflow (vælg
   tid → bekræft → få en e-mail-kvittering), uden pengetransaktion.
   Kræver kun database, ikke betalingsintegration. Laveste risiko,
   hurtigst at bygge.
2. **Fase 2 — Betalingsintegration.** Tilføj MobilePay/Stripe/Nets oven
   på det eksisterende bookingflow. Betalingsstatus opdateres via
   udbyderens "webhook" (en besked udbyderen selv sender, når
   betalingen er gennemført) — ikke ved at stole på, hvad browseren
   siger.
3. **Fase 3 — Kobling til medlemsløsning.** Kontingentbetaling
   genbruger samme betalingslag som booking, så I kun vedligeholder
   én betalingsintegration for hele platformen.

## Hvad der IKKE ændres i det eksisterende skelet

Det nuværende statiske indholds-flow (produkter, cases, tekster,
priser) forbliver upåvirket. Booking/betaling bliver et **ekstra
modul**, der kun aktiveres for de kunder, der har brug for det — resten
af platformen forbliver enkel, hurtig og uden serverafhængighed.

## Beslutning I skal tage, før vi bygger noget

- Hvilken betalingsudbyder ønsker I som standard? (MobilePay er oftest
  mest relevant for danske foreninger/klubber; Stripe hvis I ønsker
  bredere korttype-understøttelse.)
- Skal database-laget være fælles for alle kundeprojekter, eller
  separat pr. kunde? (Separat er sikrere og enklere at holde styr på
  GDPR-mæssigt; fælles er billigere at drifte.)
