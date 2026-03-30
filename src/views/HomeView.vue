<template>
  <main class="screen home-screen">
    <section class="hero-card">
      <p class="eyebrow">{{ t("app.shortTitle") }}</p>
      <h1>{{ t("app.title") }}</h1>
      <p class="subtitle">{{ t("home.subtitle") }}</p>

      <div class="player-name-field">
        <label class="player-name-label" for="player-name-input">
          {{ t("home.playerName") }}
        </label>
        <input
          id="player-name-input"
          class="player-name-input"
          type="text"
          :value="uiStore.playerName"
          :placeholder="t('game.player')"
          maxlength="20"
          autocomplete="nickname"
          @input="updatePlayerName"
        />
      </div>

      <div class="mode-switch">
        <button
          :class="['mode-button', mode === 'bo3' && 'active']"
          type="button"
          @click="setMode('bo3')"
        >
          {{ t("match.firstTo3") }}
        </button>

        <button
          :class="['mode-button', mode === 'bo5' && 'active']"
          type="button"
          @click="setMode('bo5')"
        >
          {{ t("match.firstTo5") }}
        </button>
      </div>

      <section
        :class="['daily-challenge-panel', isDailyExpanded && 'is-expanded']"
      >
        <div class="daily-challenge-header">
          <div>
            <p class="section-label">{{ t("daily.title") }}</p>
            <h2>{{ t("daily.headline") }}</h2>
          </div>

          <div class="daily-challenge-actions">
            <span :class="['daily-status-pill', dailyStatusClass]">
              {{ t(dailyStatusKey) }}
            </span>

            <button
              class="daily-toggle-button"
              type="button"
              :aria-expanded="isDailyExpanded"
              aria-controls="daily-challenge-body"
              @click="toggleDailyExpanded"
            >
              {{ t(isDailyExpanded ? "daily.showLess" : "daily.showMore") }}
            </button>
          </div>
        </div>

        <button
          class="primary-button full-width-button"
          type="button"
          :disabled="dailyStore.isCompletedToday"
          @click="handleDailyChallenge"
        >
          {{ t(dailyActionKey) }}
        </button>

        <button
          v-if="showClaimRewardButton"
          class="secondary-button full-width-button"
          type="button"
          @click="handleClaimReward"
        >
          {{ t("daily.claimReward") }}
        </button>

        <div
          v-if="isDailyExpanded"
          id="daily-challenge-body"
          class="daily-challenge-body"
        >
          <p class="daily-challenge-copy">
            {{ t("daily.description") }}
          </p>

          <div class="daily-challenge-meta">
            <span>{{ t(modeLabelKey) }}</span>
            <span>{{
              t("daily.opponents", { count: dailyChallenge?.bracketSize || 0 })
            }}</span>
            <span>{{ dailyChallenge?.dateKey }}</span>
          </div>
        </div>
      </section>

      <section v-if="missionStore.isLoaded" class="mission-panel">
        <p class="section-label">{{ t("mission.title") }}</p>
        <ul class="mission-list">
          <li
            v-for="mission in missionStore.missions"
            :key="mission.id"
            :class="[
              'mission-card',
              mission.completed && 'is-completed',
              mission.claimed && 'is-claimed',
            ]"
          >
            <div class="mission-card-header">
              <span class="mission-card-label">{{
                getMissionLabel(mission)
              }}</span>
              <span v-if="mission.claimed" class="mission-badge is-claimed">{{
                t("mission.claimed")
              }}</span>
              <span
                v-else-if="mission.completed"
                class="mission-badge is-completed"
                >{{ t("mission.completed") }}</span
              >
            </div>
            <div class="mission-progress-track">
              <div
                class="mission-progress-fill"
                :style="{ width: getMissionPercent(mission) + '%' }"
              ></div>
            </div>
            <div class="mission-progress-footer">
              <span class="mission-progress-text">
                {{ mission.progress }} / {{ mission.target }}
              </span>
              <button
                v-if="mission.completed && !mission.claimed"
                class="mission-claim-button"
                type="button"
                @click="handleClaimMission(mission.id)"
              >
                {{ t("mission.claim") }}
              </button>
            </div>
          </li>
        </ul>
      </section>

      <div class="button-stack">
        <button class="primary-button" type="button" @click="startGame">
          {{ t("menu.start") }}
        </button>

        <button
          class="secondary-button"
          type="button"
          :disabled="!hasContinue"
          @click="continueGame"
        >
          {{ t("menu.continue") }}
        </button>

        <RouterLink
          class="secondary-button"
          :to="{ path: '/rules', query: { from: 'home' } }"
        >
          {{ t("menu.rules") }}
        </RouterLink>

        <RouterLink
          class="secondary-button"
          :to="{ path: '/bracket', query: { from: 'home' } }"
        >
          {{ t("menu.bracket") }}
        </RouterLink>
      </div>

      <section class="stats-panel">
        <p class="section-label">{{ t("stats.title") }}</p>

        <p v-if="!statsStore.hasGames" class="stats-empty">
          {{ t("stats.noGames") }}
        </p>

        <template v-else>
          <div class="stats-grid">
            <div class="stats-cell">
              <span class="stats-value">{{ statsStore.totalGames }}</span>
              <span class="stats-label">{{ t("stats.totalGames") }}</span>
            </div>
            <div class="stats-cell">
              <span class="stats-value stats-value--win">{{
                statsStore.wins
              }}</span>
              <span class="stats-label">{{ t("stats.wins") }}</span>
            </div>
            <div class="stats-cell">
              <span class="stats-value stats-value--lose">{{
                statsStore.losses
              }}</span>
              <span class="stats-label">{{ t("stats.losses") }}</span>
            </div>
            <div class="stats-cell">
              <span class="stats-value">{{ statsStore.draws }}</span>
              <span class="stats-label">{{ t("stats.draws") }}</span>
            </div>
            <div class="stats-cell">
              <span class="stats-value">{{ statsStore.winrate }}%</span>
              <span class="stats-label">{{ t("stats.winrate") }}</span>
            </div>
            <div class="stats-cell">
              <span class="stats-value">{{ statsStore.currentStreak }}</span>
              <span class="stats-label">{{ t("stats.currentStreak") }}</span>
            </div>
            <div class="stats-cell">
              <span class="stats-value">{{ statsStore.bestWinStreak }}</span>
              <span class="stats-label">{{ t("stats.bestStreak") }}</span>
            </div>
          </div>

          <button
            class="stats-reset-button"
            type="button"
            @click="statsStore.resetStats()"
          >
            {{ t("stats.reset") }}
          </button>
        </template>
      </section>

      <div class="lang-switch">
        <button
          type="button"
          :aria-label="t('menu.language')"
          :title="t('menu.language')"
          @click="toggleLanguage"
        >
          {{ uiStore.locale === "hu" ? "EN" : "HU" }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { useTournamentStore } from "@/stores/tournament";
import { useGameStore } from "@/stores/game";
import { useStatsStore } from "@/stores/stats";
import { useDailyChallengeStore } from "@/stores/dailyChallenge";
import { useMissionStore } from "@/stores/mission";
import { useI18n } from "vue-i18n";
import { loadGameState, saveLanguage } from "@/utils/storage";
import { trackEvent } from "@/services/analytics";

const router = useRouter();
const uiStore = useUiStore();
const tournamentStore = useTournamentStore();
const gameStore = useGameStore();
const statsStore = useStatsStore();
const dailyStore = useDailyChallengeStore();
const missionStore = useMissionStore();
const { t, locale } = useI18n();
const isDailyExpanded = ref(false);

dailyStore.hydrateToday();
missionStore.hydrateToday();

const dailyChallenge = computed(() => dailyStore.challenge);
const savedTournament = computed(() => loadGameState()?.tournament || null);
const hasDailyResume = computed(() => {
  const tournament = savedTournament.value;
  if (!dailyStore.isSavedChallengeForToday(tournament)) return false;
  if (!tournament || tournament.tournamentFinished) return false;

  return tournamentStore.hasValidSavedTournament(tournament);
});

const mode = computed(() => tournamentStore.mode);
const hasContinue = computed(() => {
  const tournament = savedTournament.value;

  if (!tournament) return false;
  if (tournament.tournamentFinished) return false;
  if (tournament.sessionType === "daily") {
    return dailyStore.isSavedChallengeForToday(tournament);
  }

  return tournamentStore.hasValidSavedTournament(tournament);
});

const dailyStatusKey = computed(() => {
  if (dailyStore.hasWonToday && dailyStore.isClaimedToday)
    return "daily.statusClaimed";
  if (dailyStore.hasWonToday) return "daily.statusWon";
  if (dailyStore.hasLostToday) return "daily.statusLost";
  if (hasDailyResume.value) return "daily.statusInProgress";
  return "daily.statusReady";
});

const dailyStatusClass = computed(() => {
  if (dailyStore.hasWonToday && dailyStore.isClaimedToday) return "is-claimed";
  if (dailyStore.hasWonToday) return "is-won";
  if (dailyStore.hasLostToday) return "is-lost";
  if (hasDailyResume.value) return "is-active";
  return "is-ready";
});

const showClaimRewardButton = computed(() => {
  return dailyStore.hasWonToday && !dailyStore.isClaimedToday;
});

const dailyActionKey = computed(() => {
  if (hasDailyResume.value) return "daily.resume";
  if (dailyStore.isCompletedToday) return "daily.completed";
  return "daily.start";
});

const modeLabelKey = computed(() => {
  return dailyChallenge.value?.mode === "bo5"
    ? "daily.modeBo5"
    : "daily.modeBo3";
});

function toggleLanguage() {
  uiStore.toggleLocale();
  locale.value = uiStore.locale;
  saveLanguage(uiStore.locale);
}

function setMode(newMode) {
  tournamentStore.setMode(newMode);
}

function updatePlayerName(event) {
  const nextName = event?.target?.value ?? "";
  uiStore.setPlayerName(nextName);
}

function startGame() {
  gameStore.resetGame();
  tournamentStore.startNewTournament();
  router.push("/game");
}

function toggleDailyExpanded() {
  isDailyExpanded.value = !isDailyExpanded.value;
}

function handleDailyChallenge() {
  if (hasDailyResume.value) {
    dailyStore.resumeToday();
    router.push("/game?resume=1");
    return;
  }

  const challenge = dailyStore.startToday();
  trackEvent("daily_start", {
    daily_challenge_id: challenge.id,
    mode: challenge.mode,
    bracket_size: challenge.bracketSize,
    source_screen: "home",
  });

  gameStore.resetGame();
  tournamentStore.startNewTournament({
    mode: challenge.mode,
    bracket: challenge.bracket,
    size: challenge.bracketSize,
    sessionType: "daily",
    dailyChallengeId: challenge.id,
  });
  router.push("/game");
}

function handleClaimReward() {
  const claimed = dailyStore.claimReward();
  if (!claimed) return;

  trackEvent("daily_claim", {
    daily_challenge_id: dailyStore.challengeId,
    result: dailyStore.progress?.result,
    source_screen: "home",
  });
}

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

function getMissionPercent(mission) {
  if (!mission.target) return 0;
  return Math.min(100, Math.round((mission.progress / mission.target) * 100));
}

function handleClaimMission(missionId) {
  const claimed = missionStore.claimMission(missionId);
  if (!claimed) return;
  trackEvent("mission_claim", {
    mission_id: missionId,
    source_screen: "home",
  });
}

function continueGame() {
  trackEvent("continue_click", {
    source_screen: "home",
    has_saved_tournament: hasContinue.value,
    mode: tournamentStore.mode,
    action: "resume",
  });

  router.push("/game?resume=1");
}
</script>
