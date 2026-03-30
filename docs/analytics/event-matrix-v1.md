# Event Matrix v1

Datum: 2026-03-30
Statusz: Draft v1 (Day 1 output)

## Naming convention

- snake_case event nevek
- parameter kulcsok is snake_case
- kozos mezok minden eventen:
  - event_time
  - session_id
  - user_pseudo_id
  - app_version
  - platform
  - locale

## Core Day 1 eventek

| Event          | Trigger                        | Kepernyo/flow              | Parameterek                                                   | KPI kapcsolat                         |
| -------------- | ------------------------------ | -------------------------- | ------------------------------------------------------------- | ------------------------------------- |
| screen_view    | Route valtas vagy screen mount | home, game, bracket, rules | screen_name, from_route                                       | session quality, funnel drop          |
| match_start    | Uj round/match indul           | game                       | mode, opponent_id, opponent_profile, round_number             | engagement, session depth             |
| match_end      | Match veget er                 | game                       | result, player_score, ai_score, rounds_played, duration_sec   | win/loss balance, churn trigger       |
| tournament_end | Tournament lezarul             | game/bracket               | tournament_result, mode, opponents_beaten, total_duration_sec | long session, D1/D7 korrelacio        |
| continue_click | Continue gomb klikk            | home/game                  | source_screen, has_saved_tournament, mode                     | funnel continuation, churn elleni jel |

## Event mapping a jelenlegi kodhoz

- screen_view
  - route source: src/router/index.js
  - kepernyok: src/views/HomeView.vue, src/views/GameView.vue, src/views/BracketView.vue, src/views/RulesView.vue

- match_start
  - round indulasi pont: startRound() a src/stores/game.js-ben
  - game loop start pont: startGameLoop() a src/views/GameView.vue-ben

- match_end
  - eredmeny letarolasa: resolveRound() a src/stores/game.js-ben
  - stats update trigger: src/views/GameView.vue result fazis watcher

- tournament_end
  - tournament lezaras allapot: src/stores/tournament.js (win/loss vegallapot)
  - summary view: src/views/BracketView.vue

- continue_click
  - Home continue: continueGame() a src/views/HomeView.vue-ben
  - Match utani continue/advance: handleAdvance() a src/views/GameView.vue-ben

## Funnel v1

- screen_view(home)
- continue_click vagy start_game_click (kov. iteracioban kulon event)
- screen_view(game)
- match_start
- match_end
- tournament_end (ha teljes tournament vege)

## Data quality szabalyok

- match_end csak egyszer kuldheto egy match-re (dedup key: match_id)
- tournament_end csak egyszer kuldheto egy tournament_id-re
- continue_click eventnel kotelezo source_screen parameter
- null/empty mode, result, screen_name nem mehet ki
