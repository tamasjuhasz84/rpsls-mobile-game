/**
 * Nap 5 – Kritikus flow smoke tesztek
 * Flow: home → game → match_start → match_end → tournament_end
 *
 * Ezek integrációs szintű smoke tesztek: a game store és a tournament store
 * együtt viselkednek úgy, ahogy a GameView.vue vezényli őket.
 */

import { describe, it, expect } from "vitest";
import { useGameStore } from "@/stores/game";
import { useTournamentStore } from "@/stores/tournament";
import { loadGameState, saveGameState } from "@/utils/storage";

// ─── Segédfüggvények ────────────────────────────────────────────────────────

/**
 * Lejátszik egy teljes kört: game store fázisait végigvezeti, majd az eredményt
 * beregisztrálja a tournament store-ban.
 * playerMove nyeri scissorst és lizardot, aiMove ha "scissors" → player győz.
 */
function playRound(game, tournament, playerMove = "rock", aiMove = "scissors") {
  game.startRound();
  game.selectMove(playerMove);
  game.lockRound();
  game.setAiMove(aiMove);
  game.revealRound();
  game.resolveRound();
  tournament.registerRoundResult(game.result);
}

/** Megnyeri az aktuális meccset targetWins darab player-győzelemmel. */
function winMatch(game, tournament) {
  const needed = tournament.targetWins;
  for (let i = 0; i < needed; i++) {
    playRound(game, tournament, "rock", "scissors"); // rock beats scissors
  }
}

/** Elveszíti az aktuális meccset targetWins darab ai-győzelemmel. */
function loseMatch(game, tournament) {
  const needed = tournament.targetWins;
  for (let i = 0; i < needed; i++) {
    playRound(game, tournament, "scissors", "rock"); // rock beats scissors → ai nyer
  }
}

// ─── 1. HOME → GAME: Tournament start ───────────────────────────────────────

describe("flow: tournament start (home → game)", () => {
  it("startNewTournament után van currentOpponent", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    expect(t.currentOpponent).not.toBeNull();
  });

  it("bracket mérete megegyezik a kért mérettel", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4 });
    expect(t.bracket).toHaveLength(4);
  });

  it("az állapot azonnal mentésre kerül localStorage-ba", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4 });
    const saved = loadGameState();
    expect(saved?.tournament?.bracket).toHaveLength(4);
  });

  it("game store idle állapotban indul", () => {
    const g = useGameStore();
    expect(g.phase).toBe("idle");
  });
});

// ─── 2. MATCH_START → MATCH_END: Egy meccs végigkövetve ─────────────────────

describe("flow: match_start → match_end (bo3)", () => {
  it("startRound után game phase 'countdown'", () => {
    const g = useGameStore();
    g.startRound();
    expect(g.phase).toBe("countdown");
  });

  it("teljes kör után tournament playerScore nő", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    playRound(g, t, "rock", "scissors");

    expect(t.playerScore).toBe(1);
  });

  it("3 nyerő kör után matchFinished === true", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);

    expect(t.matchFinished).toBe(true);
  });

  it("matchFinished után további registerRoundResult nem módosít pontszámot", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);
    const scoreBefore = t.playerScore;
    playRound(g, t, "rock", "scissors");

    expect(t.playerScore).toBe(scoreBefore);
  });

  it("meccs after vesztve: matchFinished és tournamentLost === true", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    loseMatch(g, t);

    expect(t.matchFinished).toBe(true);
    expect(t.tournamentLost).toBe(true);
    expect(t.tournamentFinished).toBe(true);
  });
});

// ─── 3. TOURNAMENT_END: Teljes torna végigkövetve ───────────────────────────

describe("flow: tournament_end – 2-fős torna teljes győzelem", () => {
  it("2-fős tornában 2 meccs megnyerése után tournamentFinished === true", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 2, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);
    t.advanceOpponent();
    g.resetGame();

    winMatch(g, t);

    expect(t.tournamentFinished).toBe(true);
    expect(t.tournamentLost).toBe(false);
  });

  it("torna végén currentOpponent null", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 2, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);
    t.advanceOpponent();
    g.resetGame();
    winMatch(g, t);

    expect(t.currentOpponent).toBeNull();
  });

  it("torna végén minden bracket node 'defeated' státuszú", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 2, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);
    t.advanceOpponent();
    g.resetGame();
    winMatch(g, t);

    expect(t.bracket.every((node) => node.status === "defeated")).toBe(true);
  });
});

describe("flow: tournament_end – 4-fős torna teljes győzelem", () => {
  it("4 ellenfél legyőzése után tournamentFinished === true", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    for (let round = 0; round < 4; round++) {
      winMatch(g, t);
      if (round < 3) {
        t.advanceOpponent();
        g.resetGame();
      }
    }

    expect(t.tournamentFinished).toBe(true);
    expect(t.tournamentLost).toBe(false);
  });
});

// ─── 4. BO5 MÓD ──────────────────────────────────────────────────────────────

describe("flow: bo5 mód", () => {
  it("bo5-ben targetWins === 5", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 2, mode: "bo5" });
    expect(t.targetWins).toBe(5);
  });

  it("bo5-ben 3 playerWin után meccs még nem ér véget", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 2, mode: "bo5" });
    const g = useGameStore();

    for (let i = 0; i < 3; i++) {
      playRound(g, t, "rock", "scissors");
    }

    expect(t.matchFinished).toBe(false);
  });

  it("bo5-ben 5 playerWin után matchFinished === true", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 2, mode: "bo5" });
    const g = useGameStore();

    winMatch(g, t); // winMatch használja t.targetWins → 5 kör

    expect(t.matchFinished).toBe(true);
  });
});

// ─── 5. PERZISZTENCIA: Mentés és visszaállítás ───────────────────────────────

describe("flow: perzisztencia – resume tournament", () => {
  it("részleges haladás után a mentett állapot visszatölthető", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);
    t.advanceOpponent();
    // A valós app (GameView.persistState) explicit menti advanceOpponent után
    saveGameState({ tournament: t.getPersistedState() });

    const saved = loadGameState();
    expect(saved?.tournament?.currentRoundIndex).toBe(1);
    expect(saved?.tournament?.bracket).toHaveLength(4);
  });

  it("resumeTournament visszaállítja a haladást", () => {
    const t = useTournamentStore();
    t.startNewTournament({ size: 4, mode: "bo3" });
    const g = useGameStore();

    winMatch(g, t);
    t.advanceOpponent();
    // A valós app (GameView.persistState) explicit menti advanceOpponent után
    saveGameState({ tournament: t.getPersistedState() });

    const t2 = useTournamentStore();
    const result = t2.resumeTournament({ size: 4 });

    expect(result.resumed).toBe(true);
    expect(t2.currentRoundIndex).toBe(1);
    expect(t2.bracket).toHaveLength(4);
  });

  it("nincs mentett állapot esetén resumeTournament új tornát indít", () => {
    const t = useTournamentStore();
    const result = t.resumeTournament({ size: 4 });
    expect(result.resumed).toBe(false);
    expect(t.bracket).toHaveLength(4);
  });
});

// ─── 6. GAME STORE RESET KÖRKÖRÖS VISSZAÁLLÍTÁS ──────────────────────────────

describe("flow: game store resetGame meccsek között", () => {
  it("resetGame után game phase visszaáll 'idle'-re", () => {
    const g = useGameStore();
    g.startRound();
    g.selectMove("rock");
    g.lockRound();
    g.setAiMove("scissors");
    g.revealRound();
    g.resolveRound();

    g.resetGame();

    expect(g.phase).toBe("idle");
    expect(g.roundNumber).toBe(1);
    expect(g.result).toBeNull();
  });

  it("resetGame után az új meccs startRound-dal indítható", () => {
    const g = useGameStore();
    g.startRound();
    g.lockRound();
    g.resetGame();
    g.startRound();

    expect(g.phase).toBe("countdown");
    expect(g.isCountdownRunning).toBe(true);
  });
});

// ─── 7. SURVIVAL MÓD FLOW ────────────────────────────────────────────────────

describe("flow: survival mód", () => {
  it("survival mód indítása után bracket 1 elemű", () => {
    const t = useTournamentStore();
    t.startNewTournament({ mode: "survival" });
    expect(t.bracket).toHaveLength(1);
    expect(t.mode).toBe("survival");
  });

  it("meccs megnyerése után survivalOpponentsDefeated nő és tournamentFinished hamis marad", () => {
    const t = useTournamentStore();
    t.startNewTournament({ mode: "survival" });
    const g = useGameStore();

    winMatch(g, t);

    expect(t.survivalOpponentsDefeated).toBe(1);
    expect(t.tournamentFinished).toBe(false);
  });

  it("advanceOpponent után bracket bővül", () => {
    const t = useTournamentStore();
    t.startNewTournament({ mode: "survival" });
    const g = useGameStore();

    winMatch(g, t);
    t.advanceOpponent();

    expect(t.bracket).toHaveLength(2);
    expect(t.currentRoundIndex).toBe(1);
  });

  it("survival meccs elvesztésekor tournamentFinished === true", () => {
    const t = useTournamentStore();
    t.startNewTournament({ mode: "survival" });
    const g = useGameStore();

    loseMatch(g, t);

    expect(t.tournamentFinished).toBe(true);
    expect(t.tournamentLost).toBe(true);
  });
});
