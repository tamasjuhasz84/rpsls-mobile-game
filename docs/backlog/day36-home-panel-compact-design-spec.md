# Day 36 - Home panel compact UX spec (Nap 6)

Datum: 2026-03-31
Statusz: Draft v1 (implementation-ready)
Scope: Home kepernyo kompakt UX specifikacio + CSS refactor terv + vizual QA kriteriumok

---

## 1. Cel es sikerfeltetel

Nap 6 celja:

- A Home panel mobilon es desktopon kompaktabb legyen, kevesebb vertical scroll-lal.
- A quick-start blokk maradjon azonnal lathato (Start, Continue, Rules, Bracket).
- A masodlagos tartalom (Daily, Mission, Stats, Leaderboard) csak igeny szerint nyiljon.

Sikerfeltetel:

- 360x800 nezeten a hero card fold felett tartalmazza a player nevet, mode switch-et es a quick-start gombokat.
- 1280x800 nezeten a hero card max szelesseg korlat mellett maradjon olvashato es ne nyuljon 2 sorba a fo CTA.
- Nem romlik az accessibility: focus ring, hit area, kontraszt, billentyuzet navigacio.

---

## 2. Jelenlegi allapot (baseline)

Forras: src/views/HomeView.vue + src/styles/main.css

Megfigyelt baseline:

- Home layout egy kozepre igazított hero card, max-width: 420px.
- A primer elemek sorrendje jo: cim, player name, mode switch, quick actions.
- A masodlagos blokkok mar jelenleg is toggle mogott vannak (showHomeExtras).
- A card, panel es gomb meretek mar mobilra optimalizaltak, de a spacing nem egységes.
- Stats es leaderboard panel tobb kis spacing szabalyt hasznal, konzisztencia javithato.

Fobb UX frikciok:

- Tobb helyen fix px spacing van, vegyesen token alapu spacing mellett.
- A hero-card es belso panelek vertical ritmusa toredezett (6px, 8px, 10px, 14px mix).
- 360-as szelessegen a gombok es helper text neha szorosnak hatnak, kulonosen hosszabb HU stringekkel.

---

## 3. Compact UX specifikacio

### 3.1 Informacios prioritas

P0 (mindig lathato):

1. App title + subtitle
2. Player name input
3. Mode selector (bo3, bo5, survival)
4. Quick start action stack (Start, Continue, Rules, Bracket)
5. Start/continue helper text

P1 (alapbol rejtett, toggle-ra nyilik):

1. Daily panel
2. Mission panel
3. Stats panel
4. Leaderboard panel

P2 (bonus finomitas nap 7-8):

1. Hero subtitle rovidites locale-fuggoen, ha sorhossz tul nagy
2. Daily panel micro copy rovidites small viewporton

### 3.2 Breakpoint specifikacio

BP-S: 320-359 px

- Hero max-width: 100%
- Hero horizontal padding: 12px
- Primary/secondary button min-height: 38px
- Mode button min-height: 38px
- Body copy: 12px minimum

BP-M: 360-479 px

- Hero max-width: 420px
- Hero horizontal padding: 14px
- Primary/secondary button min-height: 40px
- Mode button min-height: 40px

BP-L: 480-759 px

- Hero max-width: 460px
- Hero belso panel gap +2px a BP-M-hez kepest
- Daily/mission panel 1 oszlop marad

BP-XL: 760-1023 px

- Hero max-width: 540px
- Secondary sections belso tartalom ket oszlopra valthat (csak ahol hasznos)
- Leaderboard ket oszlop marad

BP-2XL: >=1024 px

- Home screen top-aligned center layout (ne legyen vertikalisan tulzottan kozepre nyomva)
- Hero max-width: 560px
- Sectionek kozotti tavolsag novelheto +2..+4px az olvashatosag miatt

### 3.3 Interakcios szabalyok

- Home extras toggle default:
  - Mobile (<=759): closed
  - Tablet/desktop (>=760): megtarthato closed, de a state maradjon explicit
- Continue disabled state maradjon vizualisan egyertelmu (opacity + border contrast)
- Focus-visible ring minden interaktiv elemre maradjon
- Toggle gomb label explicit legyen (Show more / Hide extras)

### 3.4 Tipografia es spacing skala (Home only)

Home-only spacing cel skala:

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px

Szabaly:

- Hero fobb szekcioi kozott md vagy lg spacing
- Ugyanazon komponens belso soraiban xs vagy sm
- Kerulni kell a 6/10/14 px random mixet, hacsak nincs kulon indok

---

## 4. CSS refactor terv (2h blokk)

### 4.1 Refactor strategia

Fokusz: Home-hoz kotott stilusok konszolidalasa a main.css-ben, kulon Home token reteg bevezetesevel.

1. Bevezetni Home specifikus valtozokat:

- --home-card-max-width
- --home-card-padding
- --home-section-gap
- --home-button-min-height
- --home-mode-button-min-height

2. Kivaltani a hardcoded px ertekeket Home blokkban tokenekre.

3. Rendezni a Home CSS szerkezetet 4 blokkra:

- Home shell (home-screen, hero-card)
- Primary actions (mode-switch, button-stack, helper text)
- Secondary sections (toggle, daily, mission, stats, leaderboard)
- Home responsive media query-k

4. Egységesiteni a panel border/background intenzitast:

- home-primary-actions
- daily-challenge-panel
- mission-card
- stats-panel
- leaderboard-panel

### 4.2 Konkret selector-szintu teendok

Fajl: src/styles/main.css

Modositando prioritasok:

1. .hero-card

- max-width tokenizalas
- padding tokenizalas

2. .home-primary-actions + .button-stack

- gap es padding tokenizalas

3. .home-screen .primary-button, .home-screen .secondary-button, .home-screen .mode-button

- min-height közös Home tokenre

4. .daily-challenge-panel, .mission-card, .stats-panel, .leaderboard-panel

- vertikalis ritmus konzisztencia

5. Media query-k

- explicit Home responsive szabalyok BP-M, BP-L, BP-XL, BP-2XL savokra

### 4.3 Out-of-scope (nap 6)

- Strukturális template atalakitas HomeView.vue-ban
- Uj komponensekre bontas
- Animacios ujratervezes
- Szinpaletta vagy brand irany cserelese

---

## 5. Vizual QA kriteriumok (1h blokk)

### 5.1 Viewport matrix

Kotelezo kepernyomeretek:

- 320x568
- 360x800
- 390x844
- 768x1024
- 1280x800

### 5.2 Ellenorzesi lista

Layout:

- Hero card nem log ki viewportbol.
- Primary action stack minden viewporton olvashato es kattinthato.
- Home extras nyitott/allapot valtas nem tori a layoutot.

Tipografia:

- Cimsor max 2 sor mobilon.
- Helper text es status pill olvashato marad.
- Nem csusznak at egymasra hosszabb HU stringeknel sem.

Interakcio:

- Fokusz keret lathato minden button/link elemen.
- Disabled Continue megkulonboztetheto.
- Toggle aria-expanded allapot valtozik.

Vizual konzisztencia:

- Panel border erosseg konzisztens.
- Gomb magassagok Home-on belul konzisztensen ugyanabba a savba esnek.
- Nincs durva spacing ugras viewport valtaskor.

### 5.3 Pass/fail szabaly

Pass:

- Minden kotelezo viewporton teljesul a 5.2 checklist minden pontja.

Fail:

- Barmelyik viewporton overflow, overlapped text, vagy hasznalhatosagi hiba jelenik meg.

---

## 6. Implementacios atadas nap 7-re

Nap 7 implementacio sorrend:

1. Home tokenek bevezetese main.css-ben
2. Hero + primary actions compact spacing refactor
3. Secondary panel spacing harmonizacio
4. Breakpoint finomitas (BP-L, BP-XL, BP-2XL)
5. Visual QA matrix vegigfuttatasa

Elvart output nap 7 vegen:

- Kompakt Home panel v1
- Dokumentalt viewport screenshot csomag (internal)
