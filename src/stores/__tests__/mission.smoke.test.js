import { describe, it, expect } from "vitest";
import { useMissionStore } from "@/stores/mission";

describe("mission store", () => {
  it("hydrateToday létrehozza a napi mission pack-et", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    expect(store.dateKey).toBe("2026-03-30");
    expect(store.missions).toHaveLength(3);
  });

  it("round_wins mission progress nő player győzelemre", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const mission = store.missions.find((item) => item.type === "round_wins");
    const startProgress = mission.progress;

    store.registerRound({
      result: "player",
      playerMove: "rock",
      aiMove: "scissors",
    });

    expect(mission.progress).toBe(startProgress + 1);
  });

  it("win_streak mission draw vagy vereség esetén megszakad", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    store.registerRound({
      result: "player",
      playerMove: "rock",
      aiMove: "scissors",
    });
    store.registerRound({
      result: "player",
      playerMove: "paper",
      aiMove: "rock",
    });
    store.registerRound({ result: "ai", playerMove: "rock", aiMove: "paper" });

    expect(store.pack.currentWinStreak).toBe(0);
  });

  it("move_wins mission csak megfelelő move esetén nő", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const moveMission = store.missions.find(
      (item) => item.type === "move_wins"
    );
    const targetMove = moveMission.meta.move;

    store.registerRound({
      result: "player",
      playerMove: "rock",
      aiMove: "scissors",
    });
    const afterWrongMove = moveMission.progress;

    store.registerRound({
      result: "player",
      playerMove: targetMove,
      aiMove: "rock",
    });

    expect(moveMission.progress).toBe(
      afterWrongMove + (targetMove === "rock" ? 1 : 1)
    );
  });

  it("mission completed állapotba kerül target elérésekor", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const mission = store.missions.find((item) => item.type === "round_wins");

    for (let index = 0; index < mission.target; index += 1) {
      store.registerRound({
        result: "player",
        playerMove: "rock",
        aiMove: "scissors",
      });
    }

    expect(mission.completed).toBe(true);
    expect(mission.completedAt).toBeGreaterThan(0);
  });

  it("claimMission csak completed missionre működik", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const mission = store.missions.find((item) => item.type === "round_wins");
    expect(store.claimMission(mission.id)).toBe(false);

    for (let index = 0; index < mission.target; index += 1) {
      store.registerRound({
        result: "player",
        playerMove: "rock",
        aiMove: "scissors",
      });
    }

    expect(store.claimMission(mission.id)).toBe(true);
    expect(mission.claimed).toBe(true);
  });

  it("új napra új mission pack resetelődik", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    store.registerRound({
      result: "player",
      playerMove: "rock",
      aiMove: "scissors",
    });
    const previousMissionId = store.missions[0].id;

    store.hydrateToday(new Date(2026, 2, 31));

    expect(store.dateKey).toBe("2026-03-31");
    expect(store.missions[0].id).not.toBe(previousMissionId);
    expect(store.missions[0].progress).toBe(0);
  });

  it("claimMission idempotens: második hívás false-t ad", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const mission = store.missions.find((item) => item.type === "round_wins");

    for (let index = 0; index < mission.target; index += 1) {
      store.registerRound({
        result: "player",
        playerMove: "rock",
        aiMove: "scissors",
      });
    }

    expect(store.claimMission(mission.id)).toBe(true);
    const claimedAt = mission.claimedAt;
    expect(store.claimMission(mission.id)).toBe(false);
    expect(mission.claimedAt).toBe(claimedAt);
  });

  it("registerRound completed mission progress-ét nem növeli tovább", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const mission = store.missions.find((item) => item.type === "round_wins");

    for (let index = 0; index < mission.target; index += 1) {
      store.registerRound({
        result: "player",
        playerMove: "rock",
        aiMove: "scissors",
      });
    }

    expect(mission.completed).toBe(true);
    const lockedProgress = mission.progress;

    store.registerRound({
      result: "player",
      playerMove: "rock",
      aiMove: "scissors",
    });

    expect(mission.progress).toBe(lockedProgress);
  });

  it("move_wins ai győzelemre nem nő", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const moveMission = store.missions.find(
      (item) => item.type === "move_wins"
    );
    const targetMove = moveMission.meta.move;
    const startProgress = moveMission.progress;

    store.registerRound({
      result: "ai",
      playerMove: targetMove,
      aiMove: "rock",
    });

    expect(moveMission.progress).toBe(startProgress);
  });

  it("win_streak csúcsot megőrzi vereség után", () => {
    const store = useMissionStore();
    store.hydrateToday(new Date(2026, 2, 30));

    const streakMission = store.missions.find(
      (item) => item.type === "win_streak"
    );

    store.registerRound({
      result: "player",
      playerMove: "rock",
      aiMove: "scissors",
    });
    store.registerRound({
      result: "player",
      playerMove: "paper",
      aiMove: "rock",
    });

    const peakProgress = streakMission.progress;
    expect(peakProgress).toBeGreaterThanOrEqual(2);

    store.registerRound({ result: "ai", playerMove: "rock", aiMove: "paper" });

    expect(streakMission.progress).toBe(peakProgress);
    expect(store.pack.currentWinStreak).toBe(0);
  });
});
