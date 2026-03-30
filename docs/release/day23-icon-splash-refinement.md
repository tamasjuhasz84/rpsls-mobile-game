# Day 23 - Icon and Splash Refinement

Datum: 2026-03-30
Statusz: Draft v1

## 1. Objective

Finomhangolni a listinghez kapcsolodo vizualis alapokat:

- App icon clarity
- Splash visual consistency
- Cross-device readability

## 2. Current icon inventory

Current files in public/icons:

- apple-touch-icon.svg
- favicon.svg
- pwa-192x192.png
- pwa-512x512.png
- pwa-maskable.png
- SVG source variants for pwa icons

Generator script:

- scripts/generate-pwa-icons.js

## 3. Refinement plan

### Icon

- Keep dark cosmic base + blue accent identity.
- Increase center-shape separation for better small-size recognition.
- Validate icon at 48px, 64px, 96px preview scales.
- Keep maskable safe zone clean (no edge-critical details).

### Splash

- Reuse app palette and typography from home screen.
- Single central mark only; avoid dense detail.
- Ensure legibility on bright and dark device environments.

## 4. Optional generation workflow

If icon geometry is adjusted in script:

1. Update scripts/generate-pwa-icons.js
2. Run icon generator
3. Validate output files in public/icons

Expected output names:

- pwa-192x192.png
- pwa-512x512.png
- pwa-maskable.png

## 5. Review checklist

- [ ] Icon readable on small scale
- [ ] Maskable crop still valid
- [ ] Splash and icon style aligned
- [ ] No accidental color drift vs in-app palette
- [ ] Exported assets are optimized

## 6. Handoff note

Final icon/splash candidate should be frozen before Day 24 release build signing.
