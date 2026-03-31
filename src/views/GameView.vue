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
          <template v-if="showMotivationPanel">
            <p class="section-label">{{ t("match.nextGoalLabel") }}</p>

            <p class="match-status-text">
              {{ matchStatusText }}
            </p>

            <p class="match-status-hint">
              {{ matchStatusHint }}
            </p>

            <div v-if="matchPreviewItems.length" class="match-preview-grid">
              <article
                v-for="item in matchPreviewItems"
                :key="item.label"
                class="match-preview-card"
              >
                <p class="match-preview-label">{{ item.label }}</p>
                <p class="match-preview-value">{{ item.value }}</p>
              </article>
            </div>

            <button
              v-if="primaryActionKey"
              class="primary-button full-width-button"
              type="button"
              @click="handlePrimaryAction"
            >
              {{ t(primaryActionKey) }}
            </button>

            <section v-if="hasResultExtras" class="result-secondary-actions">
              <p class="section-label">{{ t("match.optionalActionsLabel") }}</p>

              <button
                class="secondary-button full-width-button result-more-button"
                type="button"
                :aria-expanded="isResultExtrasExpanded"
                aria-controls="result-secondary-body"
                @click="toggleResultExtras"
              >
                {{
                  t(
                    isResultExtrasExpanded
                      ? "match.hideOptions"
                      : "match.moreOptions",
                  )
                }}
              </button>

              <div
                v-if="isResultExtrasExpanded"
                id="result-secondary-body"
                class="result-secondary-body"
              >
                <button
                  v-if="secondaryActionKey"
                  class="secondary-button full-width-button"
                  type="button"
                  @click="handleSecondaryAction"
                >
                  {{ t(secondaryActionKey) }}
                </button>

                <section class="share-result-card">
                  <p class="section-label">{{ t("share.cardTitle") }}</p>
                  <p class="share-result-preview">{{ shareResultText }}</p>

                  <p
                    v-if="shouldHighlightStreak"
                    class="win-streak-highlight"
                    role="status"
                    aria-live="polite"
                  >
                    {{
                      t("share.winStreakHighlight", {
                        count: statsStore.currentStreak,
                      })
                    }}
                  </p>

                  <button
                    class="secondary-button full-width-button"
                    type="button"
                    @click="handleShareResult"
                  >
                    {{ t("share.cta") }}
                  </button>

                  <p
                    v-if="shareFeedbackKey"
                    class="share-feedback"
                    role="status"
                    aria-live="polite"
                  >
                    {{ t(shareFeedbackKey) }}
                  </p>
                </section>
              </div>
            </section>
          </template>

          <template v-else>
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

            <section v-if="hasResultExtras" class="result-secondary-actions">
              <p class="section-label">{{ t("match.optionalActionsLabel") }}</p>

              <button
                class="secondary-button full-width-button result-more-button"
                type="button"
                :aria-expanded="isResultExtrasExpanded"
                aria-controls="result-secondary-body-plain"
                @click="toggleResultExtras"
              >
                {{
                  t(
                    isResultExtrasExpanded
                      ? "match.hideOptions"
                      : "match.moreOptions",
                  )
                }}
              </button>

              <div
                v-if="isResultExtrasExpanded"
                id="result-secondary-body-plain"
                class="result-secondary-body"
              >
                <section class="share-result-card">
                  <p class="section-label">{{ t("share.cardTitle") }}</p>
                  <p class="share-result-preview">{{ shareResultText }}</p>

                  <p
                    v-if="shouldHighlightStreak"
                    class="win-streak-highlight"
                    role="status"
                    aria-live="polite"
                  >
                    {{
                      t("share.winStreakHighlight", {
                        count: statsStore.currentStreak,
                      })
                    }}
                  </p>

                  <button
                    class="secondary-button full-width-button"
                    type="button"
                    @click="handleShareResult"
                  >
                    {{ t("share.cta") }}
                  </button>

                  <p
                    v-if="shareFeedbackKey"
                    class="share-feedback"
                    role="status"
                    aria-live="polite"
                  >
                    {{ t(shareFeedbackKey) }}
                  </p>
                </section>
              </div>
            </section>
          </template>
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
import { useLeaderboardStore } from "@/stores/leaderboard";
import { saveGameState, clearGameState } from "@/utils/storage";
import { buildShareResultText } from "@/utils/shareResult";
import { trackEvent } from "@/services/analytics";

const route = useRoute();
const { t } = useI18n();
const gameStore = useGameStore();
const tournamentStore = useTournamentStore();
const uiStore = useUiStore();
const statsStore = useStatsStore();
const dailyStore = useDailyChallengeStore();
const missionStore = useMissionStore();
const leaderboardStore = useLeaderboardStore();
const { start, stop } = useCountdown();
const { getAiMove, registerRound, resetHistory } = useAiOpponent();
const { play } = useFeedbackAudio();
const { urgency, reveal, win, lose, tap } = useHaptics();

let revealTimeoutId = null;
let nextRoundTimeoutId = null;
let lastUrgencyCountdown = null;
let plannedAiMove = null;
let lastPersistedTournamentState = "";
let activeMatchKey = "";
let activeMatchStartedAt = 0;
let tournamentStartedAt = 0;
let trackedMatchStartKeys = new Set();
let trackedMatchEndKeys = new Set();
let trackedTournamentEndKeys = new Set();
let trackedDailyCompleteKeys = new Set();
let trackedLeaderboardKeys = new Set();

const resumeFailed = ref(false);
const shareFeedbackKey = ref("");
const isResultExtrasExpanded = ref(false);
const showMotivationPanel = computed(() => {
  return uiStore.isFeatureEnabled("matchEndMotivationPanel");
});

const isSurvivalSession = computed(() => tournamentStore.mode === "survival");

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

const nextOpponent = computed(() => {
  if (!showAdvanceButton.value) return null;
  return tournamentStore.bracket[tournamentStore.currentRoundIndex + 1] ?? null;
});

const defeatedOpponentsCount = computed(() => {
  if (tournamentStore.tournamentLost) {
    return tournamentStore.currentRoundIndex;
  }

  if (tournamentStore.matchFinished || tournamentStore.tournamentFinished) {
    return Math.min(
      tournamentStore.currentRoundIndex + 1,
      tournamentStore.bracket.length,
    );
  }

  return Math.min(
    tournamentStore.currentRoundIndex,
    tournamentStore.bracket.length,
  );
});

const claimableMissionCount = computed(() => {
  return missionStore.missions.filter(
    (mission) => mission.completed && !mission.claimed,
  ).length;
});

const nextMission = computed(() => {
  return (
    missionStore.missions.find(
      (mission) => !mission.completed && !mission.claimed,
    ) || null
  );
});

const shouldHighlightStreak = computed(() => {
  return statsStore.currentStreak >= 2;
});

const opponentsDefeatedForShare = computed(() => {
  if (isSurvivalSession.value) {
    return tournamentStore.survivalOpponentsDefeated;
  }

  if (tournamentStore.tournamentLost) {
    return tournamentStore.currentRoundIndex;
  }

  return defeatedOpponentsCount.value;
});

const primaryActionKey = computed(() => {
  if (showDailyClaimButton.value) return "daily.claimReward";
  if (showAdvanceButton.value) return "match.advance";
  if (
    tournamentStore.tournamentFinished &&
    tournamentStore.sessionType === "daily"
  ) {
    return "match.standardRunCta";
  }
  if (showRestartButton.value) return "match.restartTournament";
  return "";
});

const secondaryActionKey = computed(() => {
  if (showDailyClaimButton.value) return "match.standardRunCta";
  return "";
});
const hasResultExtras = computed(() => {
  return (
    Boolean(secondaryActionKey.value) ||
    tournamentStore.matchFinished ||
    tournamentStore.tournamentFinished
  );
});

const matchStatusHint = computed(() => {
  if (isSurvivalSession.value && tournamentStore.tournamentFinished) {
    return t("match.survivalLossHint", {
      score: tournamentStore.survivalScore,
      opponents: tournamentStore.survivalOpponentsDefeated,
    });
  }

  if (isSurvivalSession.value && showAdvanceButton.value) {
    return t("match.survivalContinueHint", {
      score: tournamentStore.survivalScore,
    });
  }

  if (showAdvanceButton.value && nextOpponent.value) {
    return t("match.nextOpponentHint", {
      name: nextOpponent.value.name,
      wins: tournamentStore.targetWins,
    });
  }

  if (showDailyClaimButton.value) {
    return t("match.dailyRewardReadyHint");
  }

  if (
    tournamentStore.tournamentFinished &&
    tournamentStore.sessionType === "daily"
  ) {
    return tournamentStore.tournamentLost
      ? t("match.dailyTryTomorrowHint")
      : t("match.dailyCompletedHint");
  }

  if (tournamentStore.tournamentFinished && tournamentStore.tournamentLost) {
    return t("match.tournamentLossHint");
  }

  if (tournamentStore.tournamentFinished) {
    return t("match.tournamentWinHint");
  }

  return "";
});

const matchPreviewItems = computed(() => {
  const items = [];

  if (isSurvivalSession.value) {
    items.push({
      label: t("match.survivalScoreLabel"),
      value: String(tournamentStore.survivalScore),
    });

    items.push({
      label: t("match.survivalDefeatedLabel"),
      value: t("match.survivalDefeatedValue", {
        count: tournamentStore.survivalOpponentsDefeated,
      }),
    });
  }

  if (nextOpponent.value) {
    items.push({
      label: t("match.nextOpponentLabel"),
      value: nextOpponent.value.name,
    });
  }

  if (!isSurvivalSession.value) {
    items.push({
      label: t("match.progressLabel"),
      value: t("match.progressValue", {
        current: defeatedOpponentsCount.value,
        total: tournamentStore.bracket.length,
      }),
    });
  }

  if (showDailyClaimButton.value) {
    items.push({
      label: t("match.rewardPreviewLabel"),
      value: t("match.dailyRewardCard"),
    });
  } else if (
    tournamentStore.sessionType === "daily" &&
    tournamentStore.tournamentFinished
  ) {
    items.push({
      label: t("match.rewardPreviewLabel"),
      value: dailyStore.isClaimedToday
        ? t("match.dailyRewardClaimedCard")
        : t("match.dailyCompletedCard"),
    });
  }

  if (claimableMissionCount.value > 0) {
    items.push({
      label: t("mission.title"),
      value: t("match.missionReadyCard", {
        count: claimableMissionCount.value,
      }),
    });
  } else if (nextMission.value) {
    items.push({
      label: t("mission.title"),
      value: t("match.missionProgressCard", {
        label: getMissionLabel(nextMission.value),
        progress: nextMission.value.progress,
        target: nextMission.value.target,
      }),
    });
  }

  return items;
});

const shareResultText = computed(() => {
  const modeLabel =
    tournamentStore.mode === "bo5"
      ? t("match.firstTo5")
      : isSurvivalSession.value
        ? t("match.survival")
        : t("match.firstTo3");

  return buildShareResultText({
    appTitle: t("app.title"),
    modeLabel,
    resultLabel: matchStatusText.value,
    isSurvival: isSurvivalSession.value,
    playerScore: tournamentStore.playerScore,
    aiScore: tournamentStore.aiScore,
    survivalScore: tournamentStore.survivalScore,
    opponentsDefeated: opponentsDefeatedForShare.value,
    winStreak: statsStore.currentStreak,
    labels: {
      mode: t("share.modeLabel"),
      result: t("share.resultLabel"),
      matchScore: t("share.matchScoreLabel"),
      survivalScore: t("share.survivalScoreLabel"),
      opponents: t("share.opponentsLabel"),
      winStreak: t("share.winStreakLabel"),
    },
    hashTag: "#RPSLS",
  });
});

function resetShareFeedback() {
  shareFeedbackKey.value = "";
}

function toggleResultExtras() {
  isResultExtrasExpanded.value = !isResultExtrasExpanded.value;
}

async function copyShareText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) {
    throw new Error("Copy command failed");
  }
}

async function handleShareResult() {
  const text = shareResultText.value;
  let method = "clipboard";

  try {
    if (navigator.share) {
      await navigator.share({
        title: t("share.sheetTitle"),
        text,
      });
      method = "native_share";
      shareFeedbackKey.value = "share.nativeSuccess";
    } else {
      await copyShareText(text);
      method = "clipboard";
      shareFeedbackKey.value = "share.copySuccess";
    }

    trackEvent("share_click", {
      source_screen: "game",
      mode: tournamentStore.mode,
      method,
      tournament_finished: tournamentStore.tournamentFinished,
      tournament_lost: tournamentStore.tournamentLost,
      opponents_defeated: opponentsDefeatedForShare.value,
      survival_score: tournamentStore.survivalScore,
      win_streak: statsStore.currentStreak,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      shareFeedbackKey.value = "share.cancelled";
      trackEvent("share_click", {
        source_screen: "game",
        mode: tournamentStore.mode,
        method: "native_cancelled",
        tournament_finished: tournamentStore.tournamentFinished,
        tournament_lost: tournamentStore.tournamentLost,
        opponents_defeated: opponentsDefeatedForShare.value,
        survival_score: tournamentStore.survivalScore,
        win_streak: statsStore.currentStreak,
      });
      return;
    }

    try {
      await copyShareText(text);
      method = "clipboard_fallback";
      shareFeedbackKey.value = "share.copySuccess";
      trackEvent("share_click", {
        source_screen: "game",
        mode: tournamentStore.mode,
        method,
        tournament_finished: tournamentStore.tournamentFinished,
        tournament_lost: tournamentStore.tournamentLost,
        opponents_defeated: opponentsDefeatedForShare.value,
        survival_score: tournamentStore.survivalScore,
        win_streak: statsStore.currentStreak,
      });
    } catch {
      shareFeedbackKey.value = "share.error";
    }
  }
}

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
  tournamentStore.clearRoundResultTracking();
  lastPersistedTournamentState = "";
  activeMatchKey = "";
  activeMatchStartedAt = 0;
  tournamentStartedAt = 0;
  trackedMatchStartKeys = new Set();
  trackedMatchEndKeys = new Set();
  trackedTournamentEndKeys = new Set();
  trackedDailyCompleteKeys = new Set();
  trackedLeaderboardKeys = new Set();
  isResultExtrasExpanded.value = false;
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
  if (!tournamentStartedAt) tournamentStartedAt = activeMatchStartedAt;
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
    result:
      tournamentStore.playerScore > tournamentStore.aiScore ? "player" : "ai",
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
    tournamentStartedAt,
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
    total_duration_sec: getDurationSeconds(tournamentStartedAt),
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

function getLeaderboardRunKey() {
  return [
    tournamentStore.mode,
    tournamentStore.sessionType,
    tournamentStore.dailyChallengeId || "none",
    tournamentStore.tournamentFinished ? "finished" : "running",
    tournamentStore.tournamentLost ? "lost" : "won",
    tournamentStore.survivalScore,
    tournamentStore.currentRoundIndex,
    tournamentStore.bracket.length,
  ].join("|");
}

function getFinishedOpponentsDefeated() {
  if (tournamentStore.mode === "survival") {
    return tournamentStore.survivalOpponentsDefeated;
  }

  if (tournamentStore.tournamentLost) {
    return tournamentStore.currentRoundIndex;
  }

  return tournamentStore.bracket.length;
}

function recordLeaderboardIfNeeded() {
  if (!tournamentStore.tournamentFinished) return;

  const runKey = getLeaderboardRunKey();
  if (!runKey || trackedLeaderboardKeys.has(runKey)) return;
  trackedLeaderboardKeys.add(runKey);

  leaderboardStore.recordRun({
    playerName: uiStore.playerName || t("game.player"),
    mode: tournamentStore.mode,
    sessionType: tournamentStore.sessionType,
    won: !tournamentStore.tournamentLost,
    playerScore: tournamentStore.playerScore,
    aiScore: tournamentStore.aiScore,
    survivalScore: tournamentStore.survivalScore,
    opponentsDefeated: getFinishedOpponentsDefeated(),
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
  resetShareFeedback();
  tournamentStore.startNewTournament({
    cleanup: resetLoopRuntime,
  });
  resetHistory();
  startGameLoop();
}

function resumeTournamentFlow() {
  resetShareFeedback();
  const result = tournamentStore.resumeTournament({
    cleanup: resetLoopRuntime,
  });
  resumeFailed.value = result?.resumed === false;
  resetHistory();
  startGameLoop();
}

const matchStatusText = computed(() => {
  if (isSurvivalSession.value && tournamentStore.tournamentFinished) {
    return t("match.survivalEnded");
  }

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

function getMissionLabel(mission) {
  if (mission.type === "round_wins") {
    return t("mission.roundWins", { target: mission.target });
  }
  if (mission.type === "win_streak") {
    return t("mission.winStreak", { target: mission.target });
  }
  if (mission.type === "move_wins") {
    return t("mission.moveWins", {
      target: mission.target,
      move: t(`move.${mission.meta?.move}`, mission.meta?.move ?? ""),
    });
  }
  return mission.type;
}

function handlePrimaryAction() {
  if (showDailyClaimButton.value) {
    handleClaimReward();
    return;
  }

  if (showAdvanceButton.value) {
    handleAdvance();
    return;
  }

  handleRestartTournament();
}

function handleSecondaryAction() {
  handleRestartTournament();
}

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
    resetShareFeedback();
    startGameLoop();
  }
}

function handleRestartTournament() {
  trackEvent("continue_click", {
    source_screen: "game",
    has_saved_tournament: false,
    mode: tournamentStore.mode,
    action:
      tournamentStore.sessionType === "daily"
        ? "start_standard_from_daily_end"
        : "restart_tournament",
  });

  startNewTournamentFlow();
  resetShareFeedback();
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

      if (tournamentStore.isDuplicateRoundResult(resultKey)) return;
      tournamentStore.markRoundResultProcessed(resultKey);

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
      recordLeaderboardIfNeeded();

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
  () => [tournamentStore.matchFinished, tournamentStore.tournamentFinished],
  ([matchFinished, tournamentFinished]) => {
    if (!matchFinished && !tournamentFinished) {
      isResultExtrasExpanded.value = false;
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
