<template>
  <section class="panel scoreboard">
    <div class="score-header">
      <p class="section-label">{{ t("score.matchScore") }}</p>
      <span class="score-target">{{ targetText }}</span>
    </div>

    <div class="score-main">
      <div class="score-item">
        <span class="score-label">{{ t("score.player") }}</span>
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

const tournamentStore = useTournamentStore();
const { t } = useI18n();

const targetText = computed(() => {
  return tournamentStore.targetWins === 5
    ? t("match.firstTo5")
    : t("match.firstTo3");
});
</script>
