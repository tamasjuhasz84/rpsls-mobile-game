# Day 23 - Screenshot Pipeline (Phone + Tablet + Gameplay + Stats)

Datum: 2026-03-30
Statusz: Draft v1
Target: Play Store listing screenshot package

## 1. Scope and required set

Minimum screenshot set:

- Phone gameplay
- Phone tournament/bracket
- Phone stats/leaderboard
- Tablet gameplay
- Tablet stats/leaderboard

Recommended final count:

- 6-8 image total per locale

## 2. Existing asset baseline

Current files in public/screenshots:

- rpsls-mobile.png
- rpsls-desktop-wide.png

Note:

- Existing files can be used as fallback references only.
- Final store package should be regenerated with locale-specific overlays.

## 3. Capture matrix

### HU set

- hu-phone-01-gameplay.png
- hu-phone-02-bracket.png
- hu-phone-03-stats.png
- hu-tablet-01-gameplay.png
- hu-tablet-02-stats.png

### EN set

- en-phone-01-gameplay.png
- en-phone-02-bracket.png
- en-phone-03-stats.png
- en-tablet-01-gameplay.png
- en-tablet-02-stats.png

## 4. Shot script (content order)

Order for both locales:

1. Core gameplay decision moment (moves visible)
2. Match result / momentum state
3. Tournament progress (bracket)
4. Daily challenge / mission context
5. Stats + leaderboard proof

## 5. Capture process

1. Set app language (HU or EN).
2. Prepare deterministic state:
   - one active tournament run
   - one survival score sample
   - visible stats panel with realistic values
3. Take raw captures on phone and tablet viewport.
4. Apply top-level headline overlay only (max 3-5 words).
5. Export final PNG files using naming scheme from section 3.

## 6. Composition rules

- One focal point per image.
- Keep UI readable at small listing preview size.
- Avoid overlay text over dense UI area.
- Keep visual style consistent with feature graphic.

## 7. QA checklist

- [ ] HU and EN both complete
- [ ] Phone and tablet both represented
- [ ] Gameplay and stats both represented
- [ ] No placeholder text visible
- [ ] No debug labels in screenshots
- [ ] Filenames follow exact convention

## 8. Output location

Store-ready export folder suggestion:

- docs/release/assets/day23/screenshots/
