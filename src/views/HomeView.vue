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

      <div
        class="mode-switch"
        role="group"
        :aria-label="t('home.modeSelector')"
      >
        <button
          :class="['mode-button', mode === 'bo3' && 'active']"
          type="button"
          :aria-label="t('match.firstTo3')"
          :aria-pressed="mode === 'bo3'"
          @click="setMode('bo3')"
        >
          {{ t("match.firstTo3") }}
        </button>

        <button
          :class="['mode-button', mode === 'bo5' && 'active']"
          type="button"
          :aria-label="t('match.firstTo5')"
          :aria-pressed="mode === 'bo5'"
          @click="setMode('bo5')"
        >
          {{ t("match.firstTo5") }}
        </button>

        <button
          :class="['mode-button', mode === 'survival' && 'active']"
          type="button"
          :aria-label="t('match.survival')"
          :aria-pressed="mode === 'survival'"
          @click="setMode('survival')"
        >
          {{ t("match.survival") }}
        </button>
      </div>

      <section class="home-primary-actions">
        <p class="section-label">{{ t("home.quickStartLabel") }}</p>

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

        <p class="home-helper-text">
          {{ t(startHintKey) }}
        </p>

        <p
          v-if="continueHintKey"
          class="home-helper-text home-helper-text--accent"
        >
          {{ t(continueHintKey, continueHintParams) }}
        </p>
      </section>

      <button
        class="home-secondary-toggle"
        type="button"
        :aria-expanded="showHomeExtras"
        aria-controls="home-secondary-sections"
        @click="toggleHomeExtras"
      >
        {{ t(showHomeExtras ? "home.hideExtras" : "home.showExtras") }}
      </button>

      <div
        v-if="showHomeExtras"
        id="home-secondary-sections"
        class="home-secondary-sections"
      >
        <section
          :class="['daily-challenge-panel', isDailyExpanded && 'is-expanded']"
        >
          <div class="home-collapsible-header">
            <p class="section-label">{{ t("daily.title") }}</p>
            <button
              class="home-panel-toggle"
              type="button"
              :aria-expanded="isDailyPanelExpanded"
              aria-controls="home-daily-panel"
              @click="togglePanel('daily')"
            >
              {{ getPanelToggleLabel("daily.title", isDailyPanelExpanded) }}
            </button>
          </div>

          <div v-if="isDailyPanelExpanded" id="home-daily-panel">
            <div class="daily-challenge-header">
              <div>
                <h2>{{ t("daily.headline") }}</h2>
              </div>

              <div class="daily-challenge-actions">
                <span :class="['daily-status-pill', dailyStatusClass]">
                  {{ t(dailyStatusKey) }}
                </span>

                <button
                  v-if="showDailyPromoDetails"
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

            <div
              v-if="showDailyPromoDetails && isDailyExpanded"
              id="daily-challenge-body"
              class="daily-challenge-body"
            >
              <p class="daily-challenge-copy">
                {{ t("daily.description") }}
              </p>

              <div class="daily-challenge-meta">
                <span>{{ t(modeLabelKey) }}</span>
                <span>{{
                  t("daily.opponents", {
                    count: dailyChallenge?.bracketSize || 0,
                  })
                }}</span>
                <span>{{ dailyChallenge?.dateKey }}</span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="missionStore.isLoaded" class="mission-panel">
          <div class="home-collapsible-header">
            <p class="section-label">{{ t("mission.title") }}</p>
            <button
              class="home-panel-toggle"
              type="button"
              :aria-expanded="isMissionPanelExpanded"
              aria-controls="home-mission-panel"
              @click="togglePanel('mission')"
            >
              {{ getPanelToggleLabel("mission.title", isMissionPanelExpanded) }}
            </button>
          </div>

          <ul
            v-if="isMissionPanelExpanded"
            id="home-mission-panel"
            class="mission-list"
          >
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

        <section class="stats-panel">
          <div class="home-collapsible-header">
            <p class="section-label">{{ t("stats.title") }}</p>
            <button
              class="home-panel-toggle"
              type="button"
              :aria-expanded="isStatsPanelExpanded"
              aria-controls="home-stats-panel"
              @click="togglePanel('stats')"
            >
              {{ getPanelToggleLabel("stats.title", isStatsPanelExpanded) }}
            </button>
          </div>

          <div v-if="isStatsPanelExpanded" id="home-stats-panel">
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
                  <span class="stats-value">{{
                    statsStore.currentStreak
                  }}</span>
                  <span class="stats-label">{{
                    t("stats.currentStreak")
                  }}</span>
                </div>
                <div class="stats-cell">
                  <span class="stats-value">{{
                    statsStore.bestWinStreak
                  }}</span>
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
          </div>
        </section>

        <section class="leaderboard-panel">
          <div class="home-collapsible-header">
            <p class="section-label">{{ t("leaderboard.title") }}</p>
            <button
              class="home-panel-toggle"
              type="button"
              :aria-expanded="isLeaderboardPanelExpanded"
              aria-controls="home-leaderboard-panel"
              @click="togglePanel('leaderboard')"
            >
              {{
                getPanelToggleLabel(
                  "leaderboard.title",
                  isLeaderboardPanelExpanded,
                )
              }}
            </button>
          </div>

          <div
            v-if="isLeaderboardPanelExpanded"
            id="home-leaderboard-panel"
            class="leaderboard-columns"
          >
            <article class="leaderboard-column">
              <h3 class="leaderboard-heading">{{ t("leaderboard.daily") }}</h3>
              <p v-if="!topDailyEntries.length" class="leaderboard-empty">
                {{ t("leaderboard.emptyDaily") }}
              </p>
              <ol v-else class="leaderboard-list">
                <li
                  v-for="(entry, index) in topDailyEntries"
                  :key="entry.id"
                  class="leaderboard-item"
                  :aria-label="getLeaderboardEntryA11yText(entry, index + 1)"
                >
                  <span class="leaderboard-rank">{{ index + 1 }}</span>
                  <div class="leaderboard-main">
                    <p class="leaderboard-name">{{ entry.playerName }}</p>
                    <p class="leaderboard-meta">
                      {{ getLeaderboardModeLabel(entry) }}
                    </p>
                  </div>
                  <span class="leaderboard-score">{{ entry.score }}</span>
                </li>
              </ol>
            </article>

            <article class="leaderboard-column">
              <h3 class="leaderboard-heading">
                {{ t("leaderboard.allTime") }}
              </h3>
              <p v-if="!topAllTimeEntries.length" class="leaderboard-empty">
                {{ t("leaderboard.emptyAllTime") }}
              </p>
              <ol v-else class="leaderboard-list">
                <li
                  v-for="(entry, index) in topAllTimeEntries"
                  :key="entry.id"
                  class="leaderboard-item"
                  :aria-label="getLeaderboardEntryA11yText(entry, index + 1)"
                >
                  <span class="leaderboard-rank">{{ index + 1 }}</span>
                  <div class="leaderboard-main">
                    <p class="leaderboard-name">{{ entry.playerName }}</p>
                    <p class="leaderboard-meta">
                      {{ getLeaderboardModeLabel(entry) }}
                    </p>
                  </div>
                  <span class="leaderboard-score">{{ entry.score }}</span>
                </li>
              </ol>
            </article>
          </div>
        </section>

        <section class="project-info-panel">
          <div class="home-collapsible-header">
            <p class="section-label">{{ t("home.project.title") }}</p>
            <button
              class="home-panel-toggle"
              type="button"
              :aria-expanded="isProjectPanelExpanded"
              aria-controls="home-project-panel"
              @click="togglePanel('project')"
            >
              {{
                getPanelToggleLabel(
                  "home.project.title",
                  isProjectPanelExpanded,
                )
              }}
            </button>
          </div>

          <div v-if="isProjectPanelExpanded" id="home-project-panel">
            <ul class="project-info-list">
              <li>{{ t("home.project.noAds") }}</li>
              <li>{{ t("home.project.noPaidAdvantage") }}</li>
              <li>{{ t("home.project.githubStar") }}</li>
            </ul>

            <a
              class="secondary-button project-contact-link project-github-link"
              href="https://github.com/tamasjuhasz84/rpsls-mobile-game"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="project-github-link-badge" aria-hidden="true"
                >GH</span
              >
              <span>{{ t("home.project.githubCta") }}</span>
            </a>

            <p class="project-contact-text">
              {{ t("home.project.contactIntro") }}
            </p>
            <a
              class="secondary-button project-contact-link"
              href="mailto:tamasjuhasz84@yahoo.com"
            >
              {{ t("home.project.contactCta") }}
            </a>
          </div>
        </section>
      </div>

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
import { useLeaderboardStore } from "@/stores/leaderboard";
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
const leaderboardStore = useLeaderboardStore();
const { t, locale } = useI18n();
const isDailyExpanded = ref(false);
const isHomeExtrasExpanded = ref(false);
const isDailyPanelExpanded = ref(false);
const isMissionPanelExpanded = ref(false);
const isStatsPanelExpanded = ref(false);
const isLeaderboardPanelExpanded = ref(false);
const isProjectPanelExpanded = ref(false);

dailyStore.hydrateToday();
missionStore.hydrateToday();
leaderboardStore.hydrateToday();

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

const showDailyPromoDetails = computed(() => {
  return uiStore.isFeatureEnabled("dailyChallengePromo");
});

const modeLabelKey = computed(() => {
  return dailyChallenge.value?.mode === "bo5"
    ? "daily.modeBo5"
    : "daily.modeBo3";
});

const topDailyEntries = computed(() =>
  leaderboardStore.dailyEntries.slice(0, 5),
);
const topAllTimeEntries = computed(() =>
  leaderboardStore.allTimeEntries.slice(0, 5),
);
const isFirstSessionFocus = computed(
  () => !statsStore.hasGames && !hasContinue.value,
);
const showHomeExtras = computed(() => isHomeExtrasExpanded.value);
const continueHintKey = computed(() => {
  if (!hasContinue.value) return "";
  if (savedTournament.value?.sessionType === "daily") {
    return "home.continueHintDaily";
  }
  return "home.continueHint";
});
const continueHintParams = computed(() => ({
  mode: getModeLabel(savedTournament.value?.mode),
  round: (savedTournament.value?.currentRoundIndex ?? 0) + 1,
}));
const startHintKey = computed(() =>
  isFirstSessionFocus.value ? "home.startHintFresh" : "home.startHint",
);

function getModeLabel(modeValue) {
  if (modeValue === "bo5") return t("match.firstTo5");
  if (modeValue === "survival") return t("match.survival");
  if (modeValue === "legacy") return t("leaderboard.modeLegacy");
  return t("match.firstTo3");
}

function getLeaderboardModeLabel(entry) {
  if (!entry || typeof entry !== "object") return t("match.firstTo3");
  return getModeLabel(entry.mode);
}

function getLeaderboardEntryA11yText(entry, rank) {
  return t("leaderboard.entryA11y", {
    rank,
    name: entry?.playerName || t("game.player"),
    mode: getLeaderboardModeLabel(entry),
    score: entry?.score ?? 0,
  });
}

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

function toggleHomeExtras() {
  isHomeExtrasExpanded.value = !isHomeExtrasExpanded.value;
}

function togglePanel(panel) {
  if (panel === "daily") {
    isDailyPanelExpanded.value = !isDailyPanelExpanded.value;
    return;
  }

  if (panel === "mission") {
    isMissionPanelExpanded.value = !isMissionPanelExpanded.value;
    return;
  }

  if (panel === "stats") {
    isStatsPanelExpanded.value = !isStatsPanelExpanded.value;
    return;
  }

  if (panel === "leaderboard") {
    isLeaderboardPanelExpanded.value = !isLeaderboardPanelExpanded.value;
    return;
  }

  if (panel === "project") {
    isProjectPanelExpanded.value = !isProjectPanelExpanded.value;
  }
}

function getPanelToggleLabel(titleKey, isExpanded) {
  return t(isExpanded ? "home.hideSection" : "home.showSection", {
    section: t(titleKey),
  });
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
  const tournament = savedTournament.value;
  const resumeMode = tournament?.mode || tournamentStore.mode;

  if (!hasContinue.value) {
    startGame();
    return;
  }

  trackEvent("continue_click", {
    source_screen: "home",
    has_saved_tournament: true,
    mode: resumeMode,
    action:
      tournament?.sessionType === "daily"
        ? "resume_daily_from_home"
        : "resume_standard_from_home",
    session_type: tournament?.sessionType || "standard",
    current_round_index: tournament?.currentRoundIndex ?? 0,
  });

  router.push("/game?resume=1");
}
</script>
