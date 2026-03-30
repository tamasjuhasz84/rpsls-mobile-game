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
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { useTournamentStore } from "@/stores/tournament";
import { useGameStore } from "@/stores/game";
import { useStatsStore } from "@/stores/stats";
import { useI18n } from "vue-i18n";
import { loadGameState, saveLanguage } from "@/utils/storage";
import { trackEvent } from "@/services/analytics";

const router = useRouter();
const uiStore = useUiStore();
const tournamentStore = useTournamentStore();
const gameStore = useGameStore();
const statsStore = useStatsStore();
const { t, locale } = useI18n();

const mode = computed(() => tournamentStore.mode);
const hasContinue = computed(() => {
  const saved = loadGameState();
  const tournament = saved?.tournament;

  if (!tournament) return false;
  if (tournament.tournamentFinished) return false;

  return tournamentStore.hasValidSavedTournament(tournament);
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
