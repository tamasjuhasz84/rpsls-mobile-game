import { defineStore } from "pinia";
import { buildDailyMissionPack } from "@/utils/missions";
import { getDailyChallengeDateKey } from "@/utils/dailyChallenge";
import { loadMissionState, saveMissionState } from "@/utils/storage";

const VALID_RESULTS = ["player", "ai", "draw"];

function safeNonNegativeNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

function normalizeMission(savedMission, fallbackMission) {
  const progress = Math.min(
    safeNonNegativeNumber(savedMission?.progress, 0),
    fallbackMission.target,
  );
  const completedFromProgress = progress >= fallbackMission.target;
  const completed =
    typeof savedMission?.completed === "boolean"
      ? savedMission.completed || completedFromProgress
      : completedFromProgress;

  return {
    ...fallbackMission,
    progress,
    completed,
    claimed:
      typeof savedMission?.claimed === "boolean" ? savedMission.claimed : false,
    completedAt: safeNonNegativeNumber(savedMission?.completedAt, 0),
    claimedAt: safeNonNegativeNumber(savedMission?.claimedAt, 0),
  };
}

function mergePackWithSaved(basePack, savedPack) {
  const savedByCode = new Map(
    Array.isArray(savedPack?.missions)
      ? savedPack.missions.map((mission) => [mission?.code, mission])
      : [],
  );

  return {
    ...basePack,
    currentWinStreak: safeNonNegativeNumber(savedPack?.currentWinStreak, 0),
    missions: basePack.missions.map((mission) => {
      const savedMission = savedByCode.get(mission.code);
      return normalizeMission(savedMission, mission);
    }),
  };
}

export const useMissionStore = defineStore("mission", {
  state: () => ({
    pack: null,
  }),

  getters: {
    isLoaded: (state) => Boolean(state.pack),
    dateKey: (state) => state.pack?.dateKey || "",
    missions: (state) => state.pack?.missions || [],
    completedCount: (state) =>
      (state.pack?.missions || []).filter((mission) => mission.completed)
        .length,
    claimedCount: (state) =>
      (state.pack?.missions || []).filter((mission) => mission.claimed).length,
    hasClaimableMission: (state) =>
      (state.pack?.missions || []).some(
        (mission) => mission.completed && !mission.claimed,
      ),
  },

  actions: {
    persist() {
      if (!this.pack) return;
      saveMissionState(this.pack);
    },

    hydrateToday(date = new Date()) {
      const basePack = buildDailyMissionPack(date);
      const saved = loadMissionState();

      this.pack =
        saved?.dateKey === basePack.dateKey
          ? mergePackWithSaved(basePack, saved)
          : basePack;

      this.persist();
      return this.pack;
    },

    registerRound(payload = {}) {
      if (!this.isLoaded) {
        this.hydrateToday();
      }

      const result = payload?.result;
      if (!VALID_RESULTS.includes(result)) return;

      if (result === "player") {
        this.pack.currentWinStreak += 1;
      } else {
        this.pack.currentWinStreak = 0;
      }

      this.pack.missions.forEach((mission) => {
        if (mission.completed) return;

        if (mission.type === "round_wins") {
          if (result === "player") {
            mission.progress = Math.min(mission.progress + 1, mission.target);
          }
        }

        if (mission.type === "win_streak") {
          mission.progress = Math.max(
            mission.progress,
            this.pack.currentWinStreak,
          );
          mission.progress = Math.min(mission.progress, mission.target);
        }

        if (mission.type === "move_wins") {
          if (
            result === "player" &&
            payload?.playerMove === mission.meta?.move
          ) {
            mission.progress = Math.min(mission.progress + 1, mission.target);
          }
        }

        if (mission.progress >= mission.target) {
          mission.completed = true;
          mission.completedAt = mission.completedAt || Date.now();
        }
      });

      this.persist();
    },

    claimMission(missionId) {
      if (!this.isLoaded) {
        this.hydrateToday();
      }

      const mission = this.pack.missions.find((item) => item.id === missionId);
      if (!mission) return false;
      if (!mission.completed || mission.claimed) return false;

      mission.claimed = true;
      mission.claimedAt = Date.now();
      this.persist();
      return true;
    },

    isTodayMissionPack(payload) {
      if (!payload || typeof payload !== "object") return false;
      return payload.dateKey === getDailyChallengeDateKey(new Date());
    },
  },
});
