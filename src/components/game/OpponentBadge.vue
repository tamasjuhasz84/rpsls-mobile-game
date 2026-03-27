<template>
  <section class="panel opponent-badge">
    <div class="opponent-top">
      <p class="section-label">{{ t("opponent.label") }}</p>
      <span class="opponent-round">
        {{ t("opponent.round") }} {{ tournamentStore.currentRoundIndex + 1 }}
      </span>
    </div>

    <h2 class="opponent-name" :title="opponentName">{{ opponentName }}</h2>

    <p class="opponent-subtitle">
      {{ t("game.opponentSubtitle") }}
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTournamentStore } from "@/stores/tournament";

const tournamentStore = useTournamentStore();
const { t } = useI18n();

const opponentName = computed(() => {
  return tournamentStore.currentOpponent?.name || t("opponent.fallback");
});
</script>
