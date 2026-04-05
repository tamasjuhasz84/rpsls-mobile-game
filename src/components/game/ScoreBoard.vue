<template>
  <section class="panel scoreboard">
    <div class="score-header">
      <p class="section-label">{{ t("score.matchScore") }}</p>
      <span class="score-target">{{ targetText }}</span>
    </div>

    <p v-if="isSurvivalMode" class="score-survival-line">
      {{ t("score.survivalPoints", { score: formattedSurvivalScore }) }}
    </p>

    <p v-if="isSurvivalMode" class="score-survival-meta">
      <span class="score-survival-chip">
        {{
          t("score.survivalDefeatedShort", {
            count: tournamentStore.survivalOpponentsDefeated,
          })
        }}
      </span>
      <span class="score-survival-chip">
        {{ t("score.targetWins", { count: tournamentStore.targetWins }) }}
      </span>
    </p>

    <div class="score-main">
      <div class="score-item">
        <span class="score-label">{{ playerLabel }}</span>
        <strong class="score-value">{{ tournamentStore.playerScore }}</strong>
      </div>

      <div class="score-divider">:</div>

      <div class="score-item">
        <span class="score-label">{{ t("score.ai") }}</span>
        <strong class="score-value">{{ tournamentStore.aiScore }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTournamentStore } from "@/stores/tournament";
import { useUiStore } from "@/stores/ui";

const tournamentStore = useTournamentStore();
const uiStore = useUiStore();
const { t } = useI18n();

const targetText = computed(() => {
  if (tournamentStore.mode === "survival") {
    return t("match.survival");
  }

  return tournamentStore.targetWins === 5
    ? t("match.firstTo5")
    : t("match.firstTo3");
});

const isSurvivalMode = computed(() => tournamentStore.mode === "survival");

const formattedSurvivalScore = computed(() => {
  return new Intl.NumberFormat(uiStore.locale).format(
    tournamentStore.survivalScore
  );
});

const playerLabel = computed(() => {
  return uiStore.playerName || t("game.player");
});
</script>
