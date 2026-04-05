import { describe, it, expect } from "vitest";
import { useLeaderboardStore } from "@/stores/leaderboard";

describe("leaderboard store", () => {
  it("hydrateToday üres state esetén üres listákat ad", () => {
    const store = useLeaderboardStore();

    store.hydrateToday(new Date("2026-03-30T08:00:00Z"));

    expect(store.isLoaded).toBe(true);
    expect(store.dailyEntries).toEqual([]);
    expect(store.allTimeEntries).toEqual([]);
  });

  it("stats-ból migrál legacy all-time bejegyzést", () => {
    localStorage.setItem(
      "rpsls-stats",
      JSON.stringify({
        totalGames: 20,
        wins: 12,
        losses: 6,
        draws: 2,
        bestWinStreak: 5,
      })
    );

    const store = useLeaderboardStore();
    store.hydrateToday(new Date("2026-03-30T08:00:00Z"));

    expect(store.allTimeEntries).toHaveLength(1);
    expect(store.allTimeEntries[0].mode).toBe("legacy");
    expect(store.allTimeEntries[0].score).toBeGreaterThan(0);
  });

  it("recordRun rendezve és max 10 elemmel tartja a listákat", () => {
    const store = useLeaderboardStore();
    store.hydrateToday(new Date("2026-03-30T08:00:00Z"));

    for (let i = 0; i < 12; i += 1) {
      store.recordRun({
        playerName: `P${i}`,
        mode: "survival",
        sessionType: "tournament",
        won: false,
        survivalScore: i * 100,
        opponentsDefeated: i,
      });
    }

    expect(store.dailyEntries).toHaveLength(10);
    expect(store.allTimeEntries).toHaveLength(10);
    expect(store.dailyEntries[0].score).toBeGreaterThan(
      store.dailyEntries[store.dailyEntries.length - 1].score
    );
  });
});
