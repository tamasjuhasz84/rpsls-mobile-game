import { describe, it, expect, beforeEach } from "vitest";
import {
  saveGameState,
  loadGameState,
  clearGameState,
  saveStats,
  loadStats,
  saveLanguage,
  loadLanguage,
} from "@/utils/storage";

const GAME_KEY = "rpsls-game-state";
const STATS_KEY = "rpsls-stats";
const LANG_KEY = "rpsls-lang";

describe("saveGameState / loadGameState", () => {
  it("mentés után visszaolvasható ugyanaz az objektum", () => {
    const payload = { tournament: { mode: "bo3", bracket: [] } };
    saveGameState(payload);
    expect(loadGameState()).toEqual(payload);
  });

  it("üres localStorage esetén null-t ad vissza", () => {
    expect(loadGameState()).toBeNull();
  });

  it("felülírja a korábbi mentést", () => {
    saveGameState({ v: 1 });
    saveGameState({ v: 2 });
    expect(loadGameState()).toEqual({ v: 2 });
  });

  it("beágyazott objektumokat is helyesen kezel", () => {
    const payload = {
      tournament: {
        mode: "bo5",
        playerScore: 2,
        aiScore: 1,
        bracket: [{ id: 1, name: "Borg", status: "current" }],
        currentRoundIndex: 0,
      },
    };
    saveGameState(payload);
    expect(loadGameState()).toEqual(payload);
  });
});

describe("clearGameState", () => {
  it("törlés után loadGameState null-t ad vissza", () => {
    saveGameState({ x: 1 });
    clearGameState();
    expect(loadGameState()).toBeNull();
  });

  it("többszöri hívás sem dob hibát", () => {
    expect(() => {
      clearGameState();
      clearGameState();
    }).not.toThrow();
  });
});

describe("korrupt localStorage adat", () => {
  it("érvénytelen JSON esetén null-t ad vissza", () => {
    localStorage.setItem(GAME_KEY, "ez_nem_json{{{{");
    expect(loadGameState()).toBeNull();
  });

  it("korrupt adat után a slot törlésre kerül", () => {
    localStorage.setItem(GAME_KEY, "badjson");
    loadGameState();
    expect(localStorage.getItem(GAME_KEY)).toBeNull();
  });
});

describe("saveStats / loadStats", () => {
  it("mentés + visszaolvasás roundtrip", () => {
    const stats = { wins: 10, losses: 5, winStreak: 3 };
    saveStats(stats);
    expect(loadStats()).toEqual(stats);
  });

  it("üres localStorage esetén null-t ad vissza", () => {
    expect(loadStats()).toBeNull();
  });

  it("korrupt stats JSON esetén null-t ad vissza", () => {
    localStorage.setItem(STATS_KEY, "[invalid");
    expect(loadStats()).toBeNull();
  });
});

describe("saveLanguage / loadLanguage", () => {
  it("elmenti és visszaolvassa a locale kódot", () => {
    saveLanguage("hu");
    expect(loadLanguage()).toBe("hu");
  });

  it("en locale is mentésre és visszaolvasásra kerül", () => {
    saveLanguage("en");
    expect(loadLanguage()).toBe("en");
  });

  it("üres localStorage esetén null-t ad vissza", () => {
    expect(loadLanguage()).toBeNull();
  });

  it("felülírja a korábbi locale-t", () => {
    saveLanguage("hu");
    saveLanguage("en");
    expect(loadLanguage()).toBe("en");
  });
});
