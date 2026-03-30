import { describe, it, expect } from "vitest";
import { useGameStore } from "@/stores/game";
import { MOVES } from "@/utils/gameRules";

describe("game store – alapállapot", () => {
  it("kezdeti phase értéke 'idle'", () => {
    const store = useGameStore();
    expect(store.phase).toBe("idle");
  });

  it("kezdeti countdown értéke 5", () => {
    expect(useGameStore().countdown).toBe(5);
  });

  it("kezdeti roundNumber értéke 1", () => {
    expect(useGameStore().roundNumber).toBe(1);
  });

  it("kezdeti lépések null értékűek", () => {
    const store = useGameStore();
    expect(store.currentMove).toBeNull();
    expect(store.lockedMove).toBeNull();
    expect(store.aiMove).toBeNull();
  });
});

describe("game store – startRound", () => {
  it("phase 'countdown'-ra vált", () => {
    const store = useGameStore();
    store.startRound();
    expect(store.phase).toBe("countdown");
  });

  it("countdown visszaáll 5-re", () => {
    const store = useGameStore();
    store.startRound();
    expect(store.countdown).toBe(5);
  });

  it("isCountdownRunning igazzá válik", () => {
    const store = useGameStore();
    store.startRound();
    expect(store.isCountdownRunning).toBe(true);
  });
});

describe("game store – selectMove", () => {
  it("countdown fázisban beállítja a currentMove-t", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("rock");
    expect(store.currentMove).toBe("rock");
  });

  it("érvénytelen lépést nem fogad el", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("fire");
    expect(store.currentMove).toBeNull();
  });

  it("nem countdown fázisban nem változtat semmit", () => {
    const store = useGameStore();
    store.selectMove("rock");
    expect(store.currentMove).toBeNull();
  });

  it("az összes érvényes lépés beállítható", () => {
    MOVES.forEach((move) => {
      const store = useGameStore();
      store.startRound();
      store.selectMove(move);
      expect(store.currentMove).toBe(move);
    });
  });
});

describe("game store – forceDefaultMove", () => {
  it("ha nincs currentMove, 'rock'-ra állít", () => {
    const store = useGameStore();
    store.startRound();
    store.forceDefaultMove("rock");
    expect(store.currentMove).toBe("rock");
  });

  it("ha már van currentMove, nem írja felül", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("spock");
    store.forceDefaultMove("rock");
    expect(store.currentMove).toBe("spock");
  });
});

describe("game store – lockRound", () => {
  it("countdown fázisból 'locked'-ra vált", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("scissors");
    store.lockRound();
    expect(store.phase).toBe("locked");
  });

  it("lockedMove megkapja a currentMove értékét", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("scissors");
    store.lockRound();
    expect(store.lockedMove).toBe("scissors");
  });

  it("move nélkül is zár, és 'rock'-ra defaultol", () => {
    const store = useGameStore();
    store.startRound();
    store.lockRound();
    expect(store.lockedMove).toBe("rock");
  });

  it("nem countdown fázisban nem vált phase-t", () => {
    const store = useGameStore();
    store.lockRound();
    expect(store.phase).toBe("idle");
  });
});

describe("game store – setAiMove", () => {
  it("érvényes lépést beállít", () => {
    const store = useGameStore();
    store.setAiMove("paper");
    expect(store.aiMove).toBe("paper");
  });

  it("érvénytelen lépést nem állít be", () => {
    const store = useGameStore();
    store.setAiMove("fire");
    expect(store.aiMove).toBeNull();
  });
});

describe("game store – revealRound", () => {
  it("locked fázisból 'reveal'-ra vált, ha mindkét lépés megvan", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("rock");
    store.lockRound();
    store.setAiMove("scissors");
    store.revealRound();
    expect(store.phase).toBe("reveal");
  });

  it("locked fázisban, de hiányzó aiMove esetén nem vált", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("rock");
    store.lockRound();
    store.revealRound();
    expect(store.phase).toBe("locked");
  });
});

describe("game store – resolveRound", () => {
  function reachReveal(store, playerMove, aiMove) {
    store.startRound();
    store.selectMove(playerMove);
    store.lockRound();
    store.setAiMove(aiMove);
    store.revealRound();
  }

  it("reveal fázisból 'result'-ra vált", () => {
    const store = useGameStore();
    reachReveal(store, "rock", "scissors");
    store.resolveRound();
    expect(store.phase).toBe("result");
  });

  it("player nyer: result === 'player'", () => {
    const store = useGameStore();
    reachReveal(store, "rock", "scissors");
    store.resolveRound();
    expect(store.result).toBe("player");
  });

  it("ai nyer: result === 'ai'", () => {
    const store = useGameStore();
    reachReveal(store, "scissors", "rock");
    store.resolveRound();
    expect(store.result).toBe("ai");
  });

  it("döntetlen: result === 'draw'", () => {
    const store = useGameStore();
    reachReveal(store, "rock", "rock");
    store.resolveRound();
    expect(store.result).toBe("draw");
  });

  it("a result után az explanationKey nem üres", () => {
    const store = useGameStore();
    reachReveal(store, "rock", "scissors");
    store.resolveRound();
    expect(store.explanationKey.length).toBeGreaterThan(0);
  });
});

describe("game store – nextRound", () => {
  it("roundNumber eggyel nő", () => {
    const store = useGameStore();
    store.nextRound();
    expect(store.roundNumber).toBe(2);
  });

  it("phase 'countdown'-ra vált", () => {
    const store = useGameStore();
    store.nextRound();
    expect(store.phase).toBe("countdown");
  });
});

describe("game store – resetGame", () => {
  it("minden mező visszaáll az alapállapotra", () => {
    const store = useGameStore();
    store.startRound();
    store.selectMove("rock");
    store.nextRound();
    store.resetGame();
    expect(store.phase).toBe("idle");
    expect(store.roundNumber).toBe(1);
    expect(store.currentMove).toBeNull();
    expect(store.lockedMove).toBeNull();
    expect(store.aiMove).toBeNull();
    expect(store.result).toBeNull();
    expect(store.countdown).toBe(5);
    expect(store.isCountdownRunning).toBe(false);
  });
});
