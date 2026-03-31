# Day 18 - Docs Cleanup Plan (Approve-Ready)

Datum: 2026-03-31
Statusz: Executed on Day 19
Cel: Meghatarozni, mi maradjon, mi torolheto, es hogyan tortenjen biztonsagosan a Day 19 torles.

## 0. Day 19 vegrehajtasi osszegzes

Torolve:

- `docs/analytics/day1-product-baseline.md`
- `docs/analytics/day3-qa-checklist.md`
- `docs/analytics/day4-error-monitoring.md`
- `docs/analytics/provider-spike-firebase-vs-alternatives.md`
- `docs/release/day25-internal-test-release-notes.md`

Megtartva (opcionalis historical note):

- `docs/backlog/day35-het1-review.md`

Utovizsgalat:

- Release doc hivatkozasok frissitve a torolt Day 25 note helyett Day 29 release note-ra.
- Tesztek futnak (PASS), build ellenorzes Day 19 zaraskor futtatando.

## 1. Docs inventory snapshot

Teljes markdown keszlet a `docs/` alatt: 56 fajl

- `docs/analytics`: 10
- `docs/backlog`: 21
- `docs/release`: 24
- `docs` root: 1 (`docs/user-guide-hu-en.md`)

## 2. Hivatkozasellenorzes eredmeny

Futtatott ellenorzes: README + teljes docs markdown link validacio.

Eredmeny:

- Korabban talalt hibak javitva a `docs/release/day21-privacy-policy-draft.md` fajlban.
- Aktualis allapot: `NO_BROKEN_DOC_LINKS`.

## 3. Keep list (ne toroljuk)

Kritikus, aktiv vagy frissen veglegesitett dokumentumok:

- `README.md`
- `docs/user-guide-hu-en.md`
- `docs/release/day16-release-closeout-package-v1.md`
- `docs/release/day29-release-note-v1.0.md`
- `docs/release/day30-public-release-checklist.md`
- `docs/analytics/monitoring-runbook.md`
- `docs/analytics/release-observation-package.md`
- `docs/release/day21-privacy-policy-draft.md`
- `docs/release/day21-terms-of-use-draft.md`
- `docs/release/day21-data-disclosure-matrix.md`
- `docs/release/day31-compliance-closeout-checklist.md`

## 4. Törlesre jelolt candidate lista (Day 19-hez)

Kriterium: nincs bejovo markdown hivatkozas + ideiglenes/draft/spike jelleg + ujabb vegleges dokumentum reszben vagy egeszben kivaltja.

### Candidate A - Analytics korai draft/spike csomag

1. `docs/analytics/day1-product-baseline.md`
2. `docs/analytics/day3-qa-checklist.md`
3. `docs/analytics/day4-error-monitoring.md`
4. `docs/analytics/provider-spike-firebase-vs-alternatives.md`

Indoklas:

- Korai fazisu baseline/spike dokumentumok.
- Monitoring es release-observation tema mar veglegesitett allapotban elerheto.
- Nincs rajuk bejovo markdown hivatkozas.

### Candidate B - Korabbi interim release note varians

1. `docs/release/day25-internal-test-release-notes.md`

Indoklas:

- A Day 29 + Day 16 update release note szint mar lefedi a publikacios kommunikaciot.
- Nincs bejovo markdown hivatkozas.

### Candidate C - Korabbi heti review overlap (opcionalis)

1. `docs/backlog/day35-het1-review.md`

Indoklas:

- Tartalmi overlap van a Day 15 frissitett heti review-val.
- Nincs bejovo markdown hivatkozas.
- Csak akkor toroljuk, ha nincs kulon archive igeny.

## 5. Nem torlendo, de archivalasra javasolt

Ezek jelenleg nem kritikusak, de hasznos audit trail lehetnek, ezert torles helyett archivalas javasolt:

- `docs/release/day23-*`
- `docs/release/day24-*`
- `docs/release/day25-*` (kiveve ami explicit torlesre kerul)
- `docs/backlog/day27-*` csoport

Javasolt celmappa (kesobbi): `docs/archive/`

## 6. Biztonsagos Day 19 torlesi terv

1. Jovahagyas: fenti candidate lista veglegesitese.
2. Pre-delete snapshot: `git status` + listazott torlesi fajlok ellenorzese.
3. Torles csak a jovahagyott fajlokra.
4. Post-delete check:
   - markdown link ellenorzes ujrafuttatasa,
   - `npm test`,
   - `npm run build`.
5. Changelog/docs frissites: Day 19 torlesi csomag rovid rogzitese.

## 7. Dontesek (rogzitve)

1. Candidate B (`day25-internal-test-release-notes.md`): torolve.
2. Candidate C (`day35-het1-review.md`): megtartva historical note-kent.
3. Archivalas mappa (`docs/archive/`): kesobbi iteracioban kezelendo, Day 19-ben nem kerult bevezetesre.
