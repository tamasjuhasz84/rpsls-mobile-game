import { describe, it, expect } from "vitest";
import {
  MOVES,
  WIN_RULES,
  EXPLANATION_KEYS,
  isValidMove,
  doesMoveBeat,
  isDraw,
  getWinner,
  getExplanationKey,
} from "@/utils/gameRules";

describe("MOVES konstans", () => {
  it("pontosan 5 lépést tartalmaz", () => {
    expect(MOVES).toHaveLength(5);
  });

  it("tartalmazza az összes elvárt lépést", () => {
    ["rock", "paper", "scissors", "lizard", "spock"].forEach((m) => {
      expect(MOVES).toContain(m);
    });
  });
});

describe("WIN_RULES integritás", () => {
  it("minden lépés pontosan 2 másikat ver", () => {
    MOVES.forEach((move) => {
      expect(WIN_RULES[move]).toHaveLength(2);
    });
  });

  it("egy lépés sem veri önmagát", () => {
    MOVES.forEach((move) => {
      expect(WIN_RULES[move]).not.toContain(move);
    });
  });

  it("a legyőzött lépések érvényes lépések", () => {
    MOVES.forEach((move) => {
      WIN_RULES[move].forEach((beaten) => {
        expect(MOVES).toContain(beaten);
      });
    });
  });

  it("nincs körkörös győzelem (A ver B → B nem veri A-t)", () => {
    MOVES.forEach((moveA) => {
      WIN_RULES[moveA].forEach((moveB) => {
        expect(WIN_RULES[moveB]).not.toContain(moveA);
      });
    });
  });

  it("összesen pontosan 10 győztes kapcsolat van (5×2)", () => {
    const allBeats = MOVES.flatMap((m) =>
      WIN_RULES[m].map((beaten) => [m, beaten])
    );
    expect(allBeats).toHaveLength(10);
  });
});

describe("isValidMove", () => {
  it("igaz minden érvényes lépésre", () => {
    MOVES.forEach((move) => expect(isValidMove(move)).toBe(true));
  });

  it("hamis ismeretlen sztringre", () => {
    expect(isValidMove("fire")).toBe(false);
  });

  it("hamis üres sztringre", () => {
    expect(isValidMove("")).toBe(false);
  });

  it("hamis null és undefined értékre", () => {
    expect(isValidMove(null)).toBe(false);
    expect(isValidMove(undefined)).toBe(false);
  });
});

describe("doesMoveBeat", () => {
  it("igaz, ha az első lépés veri a másodikat", () => {
    MOVES.forEach((move) => {
      WIN_RULES[move].forEach((beaten) => {
        expect(doesMoveBeat(move, beaten)).toBe(true);
      });
    });
  });

  it("hamis fordított sorrendben", () => {
    MOVES.forEach((move) => {
      WIN_RULES[move].forEach((beaten) => {
        expect(doesMoveBeat(beaten, move)).toBe(false);
      });
    });
  });

  it("hamis érvénytelen lépésre", () => {
    expect(doesMoveBeat("fire", "rock")).toBe(false);
  });
});

describe("isDraw", () => {
  it("igaz, ha mindkét lépés azonos", () => {
    MOVES.forEach((move) => expect(isDraw(move, move)).toBe(true));
  });

  it("hamis, ha a lépések különböznek", () => {
    expect(isDraw("rock", "paper")).toBe(false);
  });
});

describe("getWinner", () => {
  it("draw eredményt ad azonos lépésnél", () => {
    MOVES.forEach((move) => expect(getWinner(move, move)).toBe("draw"));
  });

  it("player eredményt ad, ha a játékos lépése nyer", () => {
    MOVES.forEach((move) => {
      WIN_RULES[move].forEach((beaten) => {
        expect(getWinner(move, beaten)).toBe("player");
      });
    });
  });

  it("ai eredményt ad, ha az AI lépése nyer", () => {
    MOVES.forEach((aiMove) => {
      WIN_RULES[aiMove].forEach((beaten) => {
        expect(getWinner(beaten, aiMove)).toBe("ai");
      });
    });
  });

  it("mind a 25 kombináció érvényes értéket ad vissza", () => {
    const valid = new Set(["player", "ai", "draw"]);
    MOVES.forEach((p) => {
      MOVES.forEach((a) => {
        expect(valid.has(getWinner(p, a))).toBe(true);
      });
    });
  });

  it("null-t ad vissza érvénytelen lépésre", () => {
    expect(getWinner("fire", "rock")).toBeNull();
    expect(getWinner("rock", "fire")).toBeNull();
    expect(getWinner(null, null)).toBeNull();
  });
});

describe("getExplanationKey", () => {
  it("rule.draw-t ad vissza azonos lépésnél", () => {
    MOVES.forEach((move) => {
      expect(getExplanationKey(move, move)).toBe("rule.draw");
    });
  });

  it("nem üres sztringet ad vissza minden különböző kombinációra", () => {
    MOVES.forEach((p) => {
      MOVES.forEach((a) => {
        if (p !== a) {
          const key = getExplanationKey(p, a);
          expect(typeof key).toBe("string");
          expect(key.length).toBeGreaterThan(0);
        }
      });
    });
  });

  it("üres sztringet ad vissza érvénytelen lépésre", () => {
    expect(getExplanationKey("fire", "rock")).toBe("");
  });

  it("az EXPLANATION_KEYS-ben megtalálható minden nyerő kulcs", () => {
    MOVES.forEach((p) => {
      MOVES.forEach((a) => {
        if (p !== a && doesMoveBeat(p, a)) {
          const key = getExplanationKey(p, a);
          expect(EXPLANATION_KEYS[`${p}_${a}`]).toBe(key);
        }
      });
    });
  });
});
