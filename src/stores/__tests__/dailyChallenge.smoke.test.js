import { describe, it, expect } from "vitest";
import { useDailyChallengeStore } from "@/stores/dailyChallenge";
import {
  loadDailyChallengeState,
  saveDailyChallengeState,
} from "@/utils/storage";

describe("dailyChallenge store", () => {
  it("hydrateToday betölti a mai challenge-et és default progress-t hoz létre", () => {
    const store = useDailyChallengeStore();
    const challenge = store.hydrateToday(new Date(2026, 2, 30));

    expect(store.challenge?.id).toBe(challenge.id);
    expect(store.progress?.dateKey).toBe("2026-03-30");
    expect(store.progress?.status).toBe("idle");
    expect(store.progress?.completed).toBe(false);
    expect(store.progress?.claimed).toBe(false);
  });

  it("hydrateToday persistál localStorage-ba", () => {
    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));
    expect(loadDailyChallengeState()?.dateKey).toBe("2026-03-30");
  });

  it("startToday in_progress státuszra vált", () => {
    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));
    store.startToday(new Date(2026, 2, 30));

    expect(store.progress?.status).toBe("in_progress");
    expect(store.progress?.startedAt).toBeGreaterThan(0);
  });

  it("markFinished('won') lezárja a napi kihívást", () => {
    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));
    store.startToday(new Date(2026, 2, 30));
    store.markFinished("won");

    expect(store.progress?.status).toBe("won");
    expect(store.progress?.completed).toBe(true);
    expect(store.progress?.completedAt).toBeGreaterThan(0);
  });

  it("markFinished('lost') elvesztettnek jelöli a napi kihívást", () => {
    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));
    store.startToday(new Date(2026, 2, 30));
    store.markFinished("lost");

    expect(store.progress?.status).toBe("lost");
    expect(store.progress?.completed).toBe(true);
    expect(store.hasLostToday).toBe(true);
  });

  it("claimReward csak completed daily-re engedélyezett", () => {
    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));

    expect(store.claimReward()).toBe(false);
    expect(store.progress?.claimed).toBe(false);

    store.startToday(new Date(2026, 2, 30));
    store.markFinished("won");

    expect(store.claimReward()).toBe(true);
    expect(store.progress?.claimed).toBe(true);
    expect(store.progress?.claimedAt).toBeGreaterThan(0);
    expect(store.claimReward()).toBe(false);
  });

  it("új napra új progress resetelődik", () => {
    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));
    store.startToday(new Date(2026, 2, 30));
    store.markFinished("won");
    store.claimReward();
    store.hydrateToday(new Date(2026, 2, 31));

    expect(store.progress?.dateKey).toBe("2026-03-31");
    expect(store.progress?.status).toBe("idle");
    expect(store.progress?.completed).toBe(false);
    expect(store.progress?.claimed).toBe(false);
  });

  it("isSavedChallengeForToday csak mai daily payloadra igaz", () => {
    const store = useDailyChallengeStore();
    expect(
      store.isSavedChallengeForToday({
        sessionType: "daily",
        dailyChallengeId: store.hydrateToday(new Date()).id,
      }),
    ).toBe(true);
  });

  it("legacy progress adatból is helyesen normalizál completed/claimed mezőt", () => {
    saveDailyChallengeState({
      dateKey: "2026-03-30",
      status: "won",
      result: "won",
      startedAt: 1,
      lastPlayedAt: 2,
      completedAt: 3,
    });

    const store = useDailyChallengeStore();
    store.hydrateToday(new Date(2026, 2, 30));

    expect(store.progress?.completed).toBe(true);
    expect(store.progress?.claimed).toBe(false);
  });
});
