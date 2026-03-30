<template>
  <main class="screen game-screen">
    <TopBar />

    <section class="game-layout">
      <section class="game-main-column">
        <section
          v-if="resumeFailed"
          class="panel resume-failed-notice"
          role="alert"
        >
          <p>{{ t("game.resumeFailed") }}</p>
        </section>

        <section
          v-if="isDailySession"
          class="panel daily-game-status-panel"
          aria-live="polite"
        >
          <p class="daily-game-status-label">{{ t("daily.title") }}</p>
          <p class="daily-game-status-text">{{ t(dailyGameStatusKey) }}</p>
          <p class="daily-game-status-meta">
            {{ dailyStore.challenge?.dateKey }}
          </p>
        </section>

        <section class="game-summary-row">
          <OpponentBadge />
          <ScoreBoard />
        </section>

        <GameBoard />

        <section
          v-if="
            tournamentStore.matchFinished || tournamentStore.tournamentFinished
          "
          class="panel match-status-panel"
        >
          <p class="match-status-text">
            {{ matchStatusText }}
          </p>

          <button
            v-if="showAdvanceButton"
            class="primary-button full-width-button"
            type="button"
            @click="handleAdvance"
          >
            {{ t("match.advance") }}
          </button>

          <button
            v-if="showRestartButton"
            class="secondary-button full-width-button"
            type="button"
            @click="handleRestartTournament"
          >
            {{ t("match.restartTournament") }}
          </button>

          <button
            v-if="showDailyClaimButton"
            class="secondary-button full-width-button"
            type="button"
            @click="handleClaimReward"
          >
            {{ t("daily.claimReward") }}
          </button>
        </section>
      </section>

      <aside class="game-side-column">
        <MoveSelector />
      </aside>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import TopBar from "@/components/ui/TopBar.vue";
import OpponentBadge from "@/components/game/OpponentBadge.vue";
import ScoreBoard from "@/components/game/ScoreBoard.vue";
import GameBoard from "@/components/game/GameBoard.vue";
import MoveSelector from "@/components/game/MoveSelector.vue";
import { useCountdown } from "@/composables/useCountdown";
import { useAiOpponent } from "@/composables/useAiOpponent";
import { useFeedbackAudio } from "@/composables/useFeedbackAudio";
import { useHaptics } from "@/composables/useHaptics";
import { useGameStore } from "@/stores/game";
import { useTournamentStore } from "@/stores/tournament";
import { useUiStore } from "@/stores/ui";
import { useStatsStore } from "@/stores/stats";
import { useDailyChallengeStore } from "@/stores/dailyChallenge";
import { useMissionStore } from "@/stores/mission";
import { saveGameState, clearGameState } from "@/utils/storage";
import { trackEvent } from "@/services/analytics";

const route = useRoute();
const { t } = useI18n();
const gameStore = useGameStore();
const tournamentStore = useTournamentStore();
const uiStore = useUiStore();
const statsStore = useStatsStore();
const dailyStore = useDailyChallengeStore();
const missionStore = useMissionStore();
const { start, stop } = useCountdown();
const { getAiMove, registerRound, resetHistory } = useAiOpponent();
const { play } = useFeedbackAudio();
const { urgency, reveal, win, lose, tap } = useHaptics();

let revealTimeoutId = null;
let nextRoundTimeoutId = null;
let lastUrgencyCountdown = null;
let plannedAiMove = null;
let lastProcessedResultKey = null;
let lastPersistedTournamentState = "";
let activeMatchKey = "";
let activeMatchStartedAt = 0;
let trackedMatchStartKeys = new Set();
let trackedMatchEndKeys = new Set();
let trackedTournamentEndKeys = new Set();
let trackedDailyCompleteKeys = new Set();

const resumeFailed = ref(false);

const isDailySession = computed(() => tournamentStore.sessionType === "daily");

const dailyGameStatusKey = computed(() => {
  if (!isDailySession.value) return "daily.statusReady";
  if (dailyStore.hasWonToday && dailyStore.isClaimedToday)
    return "daily.statusClaimed";
  if (tournamentStore.tournamentFinished && tournamentStore.tournamentLost)
    return "daily.resultLost";
  if (tournamentStore.tournamentFinished && !tournamentStore.tournamentLost)
    return "daily.resultWon";
  return "daily.statusInProgress";
});

const showDailyClaimButton = computed(() => {
  return (
    isDailySession.value &&
    tournamentStore.tournamentFinished &&
    !tournamentStore.tournamentLost &&
    dailyStore.hasWonToday &&
    !dailyStore.isClaimedToday
  );
});

function clearRoundTimeouts() {
  if (revealTimeoutId) {
    window.clearTimeout(revealTimeoutId);
    revealTimeoutId = null;
  }

  if (nextRoundTimeoutId) {
    window.clearTimeout(nextRoundTimeoutId);
    nextRoundTimeoutId = null;
  }
}

function persistState() {
  const tournamentState = tournamentStore.getPersistedState();
  const serialized = JSON.stringify(tournamentState);
  if (serialized === lastPersistedTournamentState) return;

  lastPersistedTournamentState = serialized;
  saveGameState({ tournament: tournamentState });
}

function resetLoopRuntime() {
  clearRoundTimeouts();
  stop();
  gameStore.resetGame();
  lastUrgencyCountdown = null;
  plannedAiMove = null;
  lastProcessedResultKey = null;
  lastPersistedTournamentState = "";
  activeMatchKey = "";
  activeMatchStartedAt = 0;
}

function getMatchKey() {
  const opponentId = tournamentStore.currentOpponent?.id ?? "none";
  return [
    tournamentStore.mode,
    tournamentStore.currentRoundIndex,
    opponentId,
  ].join("|");
}

function getDurationSeconds(startedAt) {
  if (!startedAt) return 0;
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  return Math.max(elapsed, 0);
}

function trackMatchStartIfNeeded(source = "unknown") {
  const matchKey = getMatchKey();
  if (!matchKey || trackedMatchStartKeys.has(matchKey)) return;

  activeMatchKey = matchKey;
  activeMatchStartedAt = Date.now();
  trackedMatchStartKeys.add(matchKey);

  trackEvent("match_start", {
    mode: tournamentStore.mode,
    opponent_id: tournamentStore.currentOpponent?.id ?? null,
    opponent_profile: tournamentStore.currentOpponent?.aiProfile ?? null,
    round_number: gameStore.roundNumber,
    source,
    current_round_index: tournamentStore.currentRoundIndex,
  });
}

function trackMatchEndIfNeeded() {
  if (!tournamentStore.matchFinished) return;

  const matchKey = activeMatchKey || getMatchKey();
  if (!matchKey || trackedMatchEndKeys.has(matchKey)) return;

  trackedMatchEndKeys.add(matchKey);

  trackEvent("match_end", {
    mode: tournamentStore.mode,
    opponent_id: tournamentStore.currentOpponent?.id ?? null,
    result: tournamentStore.tournamentLost ? "ai" : "player",
    player_score: tournamentStore.playerScore,
    ai_score: tournamentStore.aiScore,
    rounds_played: gameStore.roundNumber,
    duration_sec: getDurationSeconds(activeMatchStartedAt),
    current_round_index: tournamentStore.currentRoundIndex,
  });
}

function trackTournamentEndIfNeeded() {
  if (!tournamentStore.tournamentFinished) return;

  const tournamentKey = [
    tournamentStore.mode,
    tournamentStore.bracket.length,
    tournamentStore.tournamentLost ? "lost" : "won",
  ].join("|");

  if (trackedTournamentEndKeys.has(tournamentKey)) return;
  trackedTournamentEndKeys.add(tournamentKey);

  trackEvent("tournament_end", {
    mode: tournamentStore.mode,
    tournament_result: tournamentStore.tournamentLost ? "loss" : "win",
    opponents_beaten: tournamentStore.tournamentLost
      ? tournamentStore.currentRoundIndex
      : tournamentStore.bracket.length,
    total_rounds_played: gameStore.roundNumber,
    total_duration_sec: getDurationSeconds(activeMatchStartedAt),
  });
}

function trackDailyCompleteIfNeeded(result) {
  if (!isDailySession.value) return;
  if (result !== "won" && result !== "lost") return;

  const challengeId =
    tournamentStore.dailyChallengeId ||
    dailyStore.challengeId ||
    dailyStore.progress?.dateKey;
  if (!challengeId) return;

  const completionKey = `${challengeId}|${result}`;
  if (trackedDailyCompleteKeys.has(completionKey)) return;
  trackedDailyCompleteKeys.add(completionKey);

  trackEvent("daily_complete", {
    daily_challenge_id: challengeId,
    result,
    mode: tournamentStore.mode,
    bracket_size: tournamentStore.bracket.length,
    source_screen: "game",
  });
}

function getAiDecisionContext() {
  return {
    profile: tournamentStore.currentOpponent?.aiProfile,
    score: {
      player: tournamentStore.playerScore,
      ai: tournamentStore.aiScore,
    },
    roundNumber: gameStore.roundNumber,
  };
}

function startGameLoop() {
  clearRoundTimeouts();
  stop();

  if (tournamentStore.matchFinished || tournamentStore.tournamentFinished)
    return;
  if (!tournamentStore.currentOpponent) return;

  trackMatchStartIfNeeded("game_loop_start");

  gameStore.startRound();
  plannedAiMove = getAiMove(getAiDecisionContext());

  start(() => {
    gameStore.tickCountdown();
  }, 1000);
}

function startNewTournamentFlow() {
  resumeFailed.value = false;
  tournamentStore.startNewTournament({
    cleanup: resetLoopRuntime,
  });
  resetHistory();
  startGameLoop();
}

function resumeTournamentFlow() {
  const result = tournamentStore.resumeTournament({
    cleanup: resetLoopRuntime,
  });
  resumeFailed.value = result?.resumed === false;
  resetHistory();
  startGameLoop();
}

const matchStatusText = computed(() => {
  if (
    tournamentStore.tournamentFinished &&
    tournamentStore.sessionType === "daily"
  ) {
    return tournamentStore.tournamentLost
      ? t("daily.resultLost")
      : t("daily.resultWon");
  }

  if (tournamentStore.tournamentFinished && tournamentStore.tournamentLost) {
    return t("match.tournamentLost");
  }

  if (tournamentStore.tournamentFinished && !tournamentStore.tournamentLost) {
    return t("match.tournamentWon");
  }

  if (tournamentStore.matchFinished) {
    return t("match.opponentDefeated");
  }

  return "";
});

const showAdvanceButton = computed(() => {
  return tournamentStore.matchFinished && !tournamentStore.tournamentFinished;
});

const showRestartButton = computed(() => {
  return (
    tournamentStore.tournamentFinished &&
    tournamentStore.sessionType !== "daily"
  );
});

function handleAdvance() {
  clearRoundTimeouts();
  stop();

  trackEvent("continue_click", {
    source_screen: "game",
    has_saved_tournament: true,
    mode: tournamentStore.mode,
    action: "advance",
  });

  tournamentStore.advanceOpponent();
  gameStore.resetGame();
  resetHistory();
  persistState();

  if (!tournamentStore.tournamentFinished) {
    startGameLoop();
  }
}

function handleRestartTournament() {
  startNewTournamentFlow();
}

function handleClaimReward() {
  const claimed = dailyStore.claimReward();
  if (!claimed) return;

  trackEvent("daily_claim", {
    daily_challenge_id:
      tournamentStore.dailyChallengeId ||
      dailyStore.challengeId ||
      dailyStore.progress?.dateKey,
    result: dailyStore.progress?.result,
    source_screen: "game",
  });
}

watch(
  () => gameStore.phase,
  (phase) => {
    if (phase === "locked") {
      stop();
      clearRoundTimeouts();
      lastUrgencyCountdown = null;

      play("reveal", uiStore.soundEnabled);
      reveal(uiStore.hapticsEnabled);

      const aiMove = plannedAiMove || getAiMove(getAiDecisionContext());
      plannedAiMove = null;

      gameStore.setAiMove(aiMove);
      gameStore.revealRound();

      revealTimeoutId = window.setTimeout(() => {
        gameStore.resolveRound();
        revealTimeoutId = null;
      }, 1200);
    }

    if (phase === "result") {
      const resultKey = [
        gameStore.roundNumber,
        gameStore.lockedMove,
        gameStore.aiMove,
        gameStore.result,
      ].join("|");

      if (resultKey === lastProcessedResultKey) return;
      lastProcessedResultKey = resultKey;

      registerRound({
        playerMove: gameStore.lockedMove,
        aiMove: gameStore.aiMove,
        result: gameStore.result,
      });

      missionStore.registerRound({
        result: gameStore.result,
        playerMove: gameStore.lockedMove,
        aiMove: gameStore.aiMove,
      });
      statsStore.updateStats(gameStore.result);
      tournamentStore.registerRoundResult(gameStore.result);
      trackMatchEndIfNeeded();
      trackTournamentEndIfNeeded();

      if (gameStore.result === "player") {
        play("win", uiStore.soundEnabled);
        win(uiStore.hapticsEnabled);
      } else if (gameStore.result === "ai") {
        play("lose", uiStore.soundEnabled);
        lose(uiStore.hapticsEnabled);
      } else if (gameStore.result === "draw") {
        play("draw", uiStore.soundEnabled);
        tap(uiStore.hapticsEnabled);
      }

      if (
        tournamentStore.tournamentFinished &&
        tournamentStore.tournamentLost
      ) {
        if (tournamentStore.sessionType === "daily") {
          dailyStore.markFinished("lost");
          trackDailyCompleteIfNeeded("lost");
        }
        clearGameState();
      } else {
        if (
          tournamentStore.tournamentFinished &&
          tournamentStore.sessionType === "daily"
        ) {
          dailyStore.markFinished("won");
          trackDailyCompleteIfNeeded("won");
          clearGameState();
          return;
        }

        persistState();
      }

      nextRoundTimeoutId = window.setTimeout(() => {
        if (
          tournamentStore.matchFinished ||
          tournamentStore.tournamentFinished
        ) {
          nextRoundTimeoutId = null;
          return;
        }

        gameStore.nextRound();
        startGameLoop();
        nextRoundTimeoutId = null;
      }, 1600);
    }
  },
);

watch(
  () => gameStore.countdown,
  (value) => {
    if (!gameStore.isCountdownPhase) return;
    if (value !== 2 && value !== 1) return;
    if (lastUrgencyCountdown === value) return;

    lastUrgencyCountdown = value;
    play("countdown", uiStore.soundEnabled);
    urgency(uiStore.hapticsEnabled);
  },
);

watch(
  () => [
    tournamentStore.mode,
    tournamentStore.playerScore,
    tournamentStore.aiScore,
    tournamentStore.currentRoundIndex,
    tournamentStore.matchFinished,
    tournamentStore.tournamentFinished,
    tournamentStore.tournamentLost,
    tournamentStore.bracket,
  ],
  () => {
    if (tournamentStore.tournamentFinished && tournamentStore.tournamentLost) {
      clearGameState();
      return;
    }

    persistState();
  },
  { deep: true },
);

onMounted(() => {
  dailyStore.hydrateToday();
  missionStore.hydrateToday();

  const resumeParam = Array.isArray(route.query.resume)
    ? route.query.resume[0]
    : route.query.resume;
  const wantsResume = resumeParam === "1";

  if (wantsResume) {
    trackEvent("continue_click", {
      source_screen: "game",
      has_saved_tournament: true,
      mode: tournamentStore.mode,
      action: "resume_query_param",
    });
    resumeTournamentFlow();
    return;
  }

  if (tournamentStore.tournamentFinished) {
    return;
  }

  if (!tournamentStore.bracket.length) {
    startNewTournamentFlow();
    return;
  }

  startGameLoop();
});

onBeforeUnmount(() => {
  clearRoundTimeouts();
  stop();
});
</script>
