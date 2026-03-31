# Nap 5 / Het 1 - Heti review + kockázati lista

Datum: 2026-03-31
Statusz: Kész
Scope: V2 Het 1 lezárása — release hardening

---

## 1. Het 1 teljesített output

| Nap | Feladat                                       | Státusz                         |
| --- | --------------------------------------------- | ------------------------------- |
| 1   | Android crash monitoring véglegesítés         | ✅ Kész                         |
| 2   | Funnel adatminőség audit + dashboard          | ✅ Kész                         |
| 3   | Soft launch readout template + rollback gyak. | ✅ Kész                         |
| 4   | Store compliance nyitott pontok zárása        | ✅ Kész (Play Console manuális) |
| 5   | Regression + smoke run kritikus flow-kra      | ✅ Kész                         |

---

## 2. Smoke run eredmény (nap 5)

- **Teszt suite állapot:** 210/210 zöld (16 fájl)
- **Új kritikus flow teszt fájl:** `src/stores/__tests__/criticalFlow.smoke.test.js`

### Lefedett flow-k:

| Flow                            | Lefedett tesztek |
| ------------------------------- | ---------------- |
| home → game (tournament start)  | 4                |
| match_start → match_end (bo3)   | 5                |
| tournament_end – 2-fős torna    | 3                |
| tournament_end – 4-fős torna    | 1                |
| bo5 mód                         | 3                |
| perzisztencia (save + resume)   | 3                |
| game store reset meccsek között | 2                |
| survival mód teljes flow        | 4                |

### Felderített viselkedés (stabilitási megfigyelés):

- `advanceOpponent()` maga **nem ment** localStorage-ba — a mentés a GameView.vue
  `persistState()` feladata. A tesztek ezt a mintát reprodukálják.
  **Kockázat:** ha valaki a store API-t direkt hívja (pl. jövőbeli refactor),
  a persist ki is maradhat. Ismert, elfogadott tervezési döntés.
- `resumeTournament()` hibás / hiányzó mentés esetén új tornát indít — helyes fallback.
- Survival bracket végtelen bővítése stabilan működik.

### Stabilitási hibajavítás szükséglet:

Nem volt szükséges — 0 production bug a smoke run alapján.

---

## 3. Nyitott kockázati lista

| #   | Kockázat                                           | Súly | Státusz              |
| --- | -------------------------------------------------- | ---- | -------------------- |
| 1   | Play Console Data Safety kérdőív ki nem töltve     | P0   | Manuális feladat     |
| 2   | EEA → US adattovábbítási safeguard szöveg hiányzik | P1   | Elfogadott, dok-ban  |
| 3   | Consent popup nincs (MVP döntés)                   | P1   | Elfogadott, dok-ban  |
| 4   | `advanceOpponent` + persist szétválasztás refactor | P2   | Backlog, nem sürgős  |
| 5   | Vercel deploy validálás (/privacy, /terms élők-e)  | P1   | Deploy után ellenőrz |

---

## 4. Het 2 előkészítés

**Következő blokk: V2 Het 2 — P0+ UX és kommunikáció**

Nap 6 (legközelebbi): Home panel kompakt UX specifikáció

- Mobil + desktop breakpoint definíció
- CSS refactor terv (spacing, max-width, panel stack)
- Vizuális QA kritériumok

**Blokkba vitt bemenetek:**

- Compliance csomag lezárt (Play Console kivételével)
- /privacy és /terms route-ok Vercel-en (deploy szükséges)
- 210 smoke teszt zöld
- Release hardening: kész

---

## 5. V2 Het 1 összesítő metrikák

| Metrika                     | Érték            |
| --------------------------- | ---------------- |
| Létrehozott fájlok összesen | 8 (docs + src)   |
| Módosított fájlok összesen  | 8                |
| Teszt fájlok száma          | 16               |
| Tesztesetek száma           | 210              |
| Sikertelen teszt a végén    | 0                |
| Nyitott P0 feladat          | 1 (Play Console) |
