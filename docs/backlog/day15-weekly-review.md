# Day 15 - Heti Review es Risk Lista

Datum: 2026-03-30
Statusz: Completed

## Het 3 osszefoglalo

- Day 11-12: onboarding tutorial flow kesz, skip path-tal es meressel.
- Day 13: AI pacing tuning, local playtest script, cel-sav CSV.
- Day 14: match end motivacios panel es CTA erosites.
- Day 15: feature flag prep a retention feluletekhez + regresszios ellenorzes.

## Jelenlegi eros pontok

- Az onboarding, daily es mission retention loop mar nem kulonallo elemek, hanem ugyanabban a jatekflowban kapcsolodnak ossze.
- A Day 14 motivacios panel mar kontrollalhato flag alatt fut, igy kisebb a rollout kockazata.
- A Node-kompatibilis playtest script mar a tuning gyors ujraellenorzeset is lehetove teszi.

## Fobb kockazatok

1. A Day 13 winrate-ek nem mindenhol erik el a cel CSV savjait.

- A local random-playtest szerint a korai ellenfelek meg mindig gyengebb kezdobarat savban vannak a celhoz kepest.
- Kovetkezo javaslat: manual play session + celzott easing a legelso 2 ellenfelre, ha a valos jatekos erzet is ezt erositi meg.

2. Nincs remote assignment / experiment backend.

- A flag rendszer most local persisted + dev query override alapu.
- Kovetkezo javaslat: kesobbi hetben egyszeru remote config vagy build-time env flag support.

3. A Day 14 panelhez nincs kulon komponenszintu UI smoke teszt.

- A jelenlegi validacio test + build + store smoke szinten eros, de a panel ket valtozata (flag on/off) nincs DOM szinten automatizalva.
- Kovetkezo javaslat: kesobb egy minimalis view/component smoke teszt a meccsvegi CTA variansokra.

## Go-forward

- Het 3 output a roadmap szerint stabilnak tekintheto.
- A kovetkezo logikus blokk a Het 4 Day 16: opponent archetype terv, uj ellenfel profilok es nev generator tuning, flavor text.
