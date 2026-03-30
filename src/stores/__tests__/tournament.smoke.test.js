import { describe, it, expect } from "vitest";
import { useTournamentStore } from "@/stores/tournament";
import { loadGameState } from "@/utils/storage";

// ─── Segédfüggvény ────────────────────────────────────────────────────────────
function setupStore(opts = {}) {
  const store = useTournamentStore();
  store.startNewTournament({ size: opts.size ?? 4, mode: opts.mode ?? "bo3" });
  return store;
}

function winMatch(store, wins = 3) {
  for (let i = 0; i < wins; i++) {
    store.registerRoundResult("player");
  }
}

function loseMatch(store, wins = 3) {
  for (let i = 0; i < wins; i++) {
    store.registerRoundResult("ai");
  }
}

// ─── startNewTournament ───────────────────────────────────────────────────────
describe("startNewTournament", () => {
  it("bracketben pontosan annyi elem van, amennyit kértünk", () => {
    const store = setupStore({ size: 4 });
    expect(store.bracket).toHaveLength(4);
  });

  it("currentOpponent az első csomópont", () => {
    const store = setupStore({ size: 4 });
    expect(store.currentOpponent).toBe(store.bracket[0]);
  });

  it("az állapot menti magát localStorage-ba", () => {
    setupStore({ size: 4 });
    const saved = loadGameState();
    expect(saved?.tournament).toBeDefined();
    expect(saved.tournament.bracket).toHaveLength(4);
  });

  it("bo5 mód esetén targetWins === 5", () => {
    const store = setupStore({ mode: "bo5" });
    expect(store.targetWins).toBe(5);
  });

  it("bo3 mód esetén targetWins === 3", () => {
    const store = setupStore({ mode: "bo3" });
    expect(store.targetWins).toBe(3);
  });

  it("survival mód esetén targetWins === 3 és mode survival", () => {
    const store = setupStore({ mode: "survival" });
    expect(store.mode).toBe("survival");
    expect(store.targetWins).toBe(3);
  });

  it("newTournament előtt törli a korábbi mentést", () => {
    const store = setupStore({ size: 4 });
    store.startNewTournament({ size: 2 });
    expect(loadGameState()?.tournament.bracket).toHaveLength(2);
  });
});

// ─── registerRoundResult ─────────────────────────────────────────────────────
describe("registerRoundResult", () => {
  it("player win esetén playerScore nő", () => {
    const store = setupStore();
    store.registerRoundResult("player");
    expect(store.playerScore).toBe(1);
  });

  it("ai win esetén aiScore nő", () => {
    const store = setupStore();
    store.registerRoundResult("ai");
    expect(store.aiScore).toBe(1);
  });

  it("draw esetén egyetlen score sem változik", () => {
    const store = setupStore();
    store.registerRoundResult("draw");
    expect(store.playerScore).toBe(0);
    expect(store.aiScore).toBe(0);
  });

  it("matchFinished után nem számol be több pontot", () => {
    const store = setupStore();
    winMatch(store);
    const pScoreAfterMatch = store.playerScore;
    store.registerRoundResult("player");
    expect(store.playerScore).toBe(pScoreAfterMatch);
  });
});

// ─── checkMatchEnd (bo3) ─────────────────────────────────────────────────────
describe("checkMatchEnd – bo3", () => {
  it("3 player win után matchFinished === true", () => {
    const store = setupStore();
    winMatch(store, 3);
    expect(store.matchFinished).toBe(true);
  });

  it("3 ai win után matchFinished === true és tournamentLost === true", () => {
    const store = setupStore();
    loseMatch(store, 3);
    expect(store.matchFinished).toBe(true);
    expect(store.tournamentLost).toBe(true);
    expect(store.tournamentFinished).toBe(true);
  });

  it("2 player win után a meccs még nem ér véget", () => {
    const store = setupStore();
    winMatch(store, 2);
    expect(store.matchFinished).toBe(false);
  });

  it("közbenső opponent legyőzésekor tournamentFinished marad hamis", () => {
    const store = setupStore({ size: 4 });
    winMatch(store, 3);
    expect(store.tournamentFinished).toBe(false);
  });
});

// ─── Torna vége ──────────────────────────────────────────────────────────────
describe("tournament vége", () => {
  it("utolsó opponent legyőzésekor tournamentFinished === true", () => {
    const store = setupStore({ size: 2 });
    winMatch(store, 3);
    store.advanceOpponent();
    winMatch(store, 3);
    expect(store.tournamentFinished).toBe(true);
    expect(store.tournamentLost).toBe(false);
  });
});

// ─── advanceOpponent ─────────────────────────────────────────────────────────
describe("advanceOpponent", () => {
  it("következő ellenfélre lép, indexet növeli", () => {
    const store = setupStore({ size: 4 });
    winMatch(store, 3);
    store.advanceOpponent();
    expect(store.currentRoundIndex).toBe(1);
  });

  it("pontszámot nulláz", () => {
    const store = setupStore({ size: 4 });
    winMatch(store, 3);
    store.advanceOpponent();
    expect(store.playerScore).toBe(0);
    expect(store.aiScore).toBe(0);
  });

  it("matchFinished visszaáll hamisra", () => {
    const store = setupStore({ size: 4 });
    winMatch(store, 3);
    store.advanceOpponent();
    expect(store.matchFinished).toBe(false);
  });

  it("meccs vége nélkül nem lép tovább", () => {
    const store = setupStore({ size: 4 });
    store.advanceOpponent();
    expect(store.currentRoundIndex).toBe(0);
  });

  it("survival módban új ellenfelet generál, ha elfogyott a bracket", () => {
    const store = setupStore({ mode: "survival" });
    const initialLength = store.bracket.length;

    winMatch(store, 3);
    store.advanceOpponent();

    expect(store.currentRoundIndex).toBe(1);
    expect(store.bracket.length).toBe(initialLength + 1);
    expect(store.matchFinished).toBe(false);
  });
});

describe("survival scoring", () => {
  it("player körgyőzelem pontot ad survival módban", () => {
    const store = setupStore({ mode: "survival" });
    const before = store.survivalScore;

    store.registerRoundResult("player");

    expect(store.survivalScore).toBeGreaterThan(before);
    expect(store.survivalRoundWins).toBe(1);
  });

  it("meccsgyőzelemkor nő a survival ellenfél számláló és score", () => {
    const store = setupStore({ mode: "survival" });

    winMatch(store, 3);

    expect(store.survivalOpponentsDefeated).toBe(1);
    expect(store.survivalScore).toBeGreaterThan(120);
    expect(store.tournamentFinished).toBe(false);
    expect(store.matchFinished).toBe(true);
  });

  it("survival módban vereségre véget ér a run", () => {
    const store = setupStore({ mode: "survival" });

    loseMatch(store, 3);

    expect(store.tournamentFinished).toBe(true);
    expect(store.tournamentLost).toBe(true);
  });
});

// ─── hasValidSavedTournament ─────────────────────────────────────────────────
describe("hasValidSavedTournament", () => {
  const validBracket = [
    { id: 1, name: "Alpha" },
    { id: 2, name: "Beta" },
  ];

  it("érvényes payload esetén igaz", () => {
    const store = useTournamentStore();
    expect(
      store.hasValidSavedTournament({
        bracket: validBracket,
        currentRoundIndex: 0,
      }),
    ).toBe(true);
  });

  it("null payload esetén hamis", () => {
    expect(useTournamentStore().hasValidSavedTournament(null)).toBe(false);
  });

  it("üres bracket esetén hamis", () => {
    expect(
      useTournamentStore().hasValidSavedTournament({
        bracket: [],
        currentRoundIndex: 0,
      }),
    ).toBe(false);
  });

  it("hiányzó bracket esetén hamis", () => {
    expect(
      useTournamentStore().hasValidSavedTournament({ currentRoundIndex: 0 }),
    ).toBe(false);
  });

  it("name nélküli csomópont esetén hamis", () => {
    expect(
      useTournamentStore().hasValidSavedTournament({
        bracket: [{ id: 1 }],
        currentRoundIndex: 0,
      }),
    ).toBe(false);
  });

  it("határokon kívüli index esetén hamis", () => {
    expect(
      useTournamentStore().hasValidSavedTournament({
        bracket: validBracket,
        currentRoundIndex: 5,
      }),
    ).toBe(false);
  });

  it("negatív index esetén hamis", () => {
    expect(
      useTournamentStore().hasValidSavedTournament({
        bracket: validBracket,
        currentRoundIndex: -1,
      }),
    ).toBe(false);
  });
});

// ─── hydrateFromStorage ───────────────────────────────────────────────────────
describe("hydrateFromStorage", () => {
  it("visszaállítja a mentett módot", () => {
    const store = useTournamentStore();
    store.hydrateFromStorage({
      mode: "bo5",
      bracket: [],
      playerScore: 0,
      aiScore: 0,
    });
    expect(store.mode).toBe("bo5");
    expect(store.targetWins).toBe(5);
  });

  it("visszaállítja a pontszámokat", () => {
    const store = useTournamentStore();
    store.hydrateFromStorage({
      mode: "bo3",
      playerScore: 2,
      aiScore: 1,
      bracket: [{ id: 1, name: "X" }],
      currentRoundIndex: 0,
    });
    expect(store.playerScore).toBe(2);
    expect(store.aiScore).toBe(1);
  });

  it("currentOpponent a bracket[currentRoundIndex]-re mutat", () => {
    const bracket = [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Beta" },
    ];
    const store = useTournamentStore();
    store.hydrateFromStorage({
      mode: "bo3",
      playerScore: 0,
      aiScore: 0,
      bracket,
      currentRoundIndex: 1,
    });
    // Pinia reaktív proxyt csomagol a bracket elemek köré, ezért mély egyenlőséget vizsgálunk
    expect(store.currentOpponent).toStrictEqual(bracket[1]);
  });

  it("határon kívüli index esetén 0-ra visszaesik", () => {
    const bracket = [{ id: 1, name: "Alpha" }];
    const store = useTournamentStore();
    store.hydrateFromStorage({
      mode: "bo3",
      bracket,
      currentRoundIndex: 99,
    });
    expect(store.currentRoundIndex).toBe(0);
  });
});

// ─── resumeTournament ─────────────────────────────────────────────────────────
describe("resumeTournament", () => {
  it("érvényes mentésre {resumed: true} és hydrated state", () => {
    const store = setupStore({ size: 4 });
    store.registerRoundResult("player");

    const freshStore = useTournamentStore();
    const result = freshStore.resumeTournament({ size: 4 });

    expect(result.resumed).toBe(true);
    expect(freshStore.bracket).toHaveLength(4);
  });

  it("mentés nélkül {resumed: false} és új tornát indít", () => {
    const store = useTournamentStore();
    const result = store.resumeTournament({ size: 4 });

    expect(result.resumed).toBe(false);
    expect(store.bracket).toHaveLength(4);
  });

  it("érvénytelen/korrupt mentésnél új tornát indít", () => {
    localStorage.setItem(
      "rpsls-game-state",
      JSON.stringify({ tournament: { bracket: [], currentRoundIndex: 0 } }),
    );
    const store = useTournamentStore();
    const result = store.resumeTournament({ size: 4 });

    expect(result.resumed).toBe(false);
    expect(store.bracket).toHaveLength(4);
  });
});

describe("round result dedup tracking", () => {
  it("markRoundResultProcessed után azonos kulcsra duplikátumot jelez", () => {
    const store = useTournamentStore();
    const key = "1|rock|paper|ai";

    expect(store.isDuplicateRoundResult(key)).toBe(false);
    store.markRoundResultProcessed(key);
    expect(store.isDuplicateRoundResult(key)).toBe(true);
  });

  it("clearRoundResultTracking nullázza a dedup kulcsot", () => {
    const store = useTournamentStore();
    const key = "1|scissors|paper|player";

    store.markRoundResultProcessed(key);
    store.clearRoundResultTracking();
    expect(store.isDuplicateRoundResult(key)).toBe(false);
  });
});
