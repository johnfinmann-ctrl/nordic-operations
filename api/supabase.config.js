/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — api/supabase.config.js
   ------------------------------------------------------------------------
   STATUS: PLACEHOLDER. Ikke aktiv. Ikke importeret af nogen side endnu.

   Denne fil definerer FORMEN på Supabase-konfigurationen, så resten af
   platformen kan skrives mod en stabil grænseflade, før et rigtigt
   Supabase-projekt eksisterer. Når I opretter projektet, udfyldes kun
   url/anonKey herunder — ingen anden fil skal ændres.

   SIKKERHEDSREGLER (ufravigelige):
   - KUN "anon/public key" må nogensinde stå her eller i anden frontend-kode.
     Den nøgle er designet til at være offentlig og styres af Row Level
     Security i Supabase — ikke af hemmeligholdelse.
   - "Service Role Key" (den nøgle der omgår RLS) må ALDRIG lægges i denne
     fil, i noget under css/js/pages/admin, eller committes til Git
     overhovedet. Den hører hjemme i et serverless-miljø (fx en GitHub
     Actions "secret" eller en Supabase Edge Function), aldrig i browseren.
   - Denne fil indeholder bevidst INGEN rigtige værdier endnu.
   ========================================================================== */

window.NordicSupabaseConfig = {
  active: false, // sættes til true først når et rigtigt projekt er koblet på
  url: '',        // fx 'https://xxxx.supabase.co' — udfyldes ved aktivering
  anonKey: '',    // KUN anon/public key. Aldrig service_role.
  notes: 'Placeholder. Se docs/supabase-migration-plan.md for aktiveringstrin.'
};
