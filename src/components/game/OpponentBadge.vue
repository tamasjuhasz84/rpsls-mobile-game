<template>
  <section class="panel opponent-badge">
    <div class="opponent-top">
      <p class="section-label">{{ t("opponent.label") }}</p>
      <span class="opponent-round">
        {{ t("opponent.round") }} {{ tournamentStore.currentRoundIndex + 1 }}
      </span>
    </div>

    <h2 class="opponent-name" :title="opponentName">{{ opponentName }}</h2>

    <p class="opponent-subtitle">{{ archetypeLabel }}</p>
    <p v-if="opponentIntroText" class="opponent-intro">
      {{ opponentIntroText }}
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTournamentStore } from "@/stores/tournament";

const tournamentStore = useTournamentStore();
const { t, te } = useI18n();

const opponentName = computed(() => {
  return tournamentStore.currentOpponent?.name || t("opponent.fallback");
});

const archetypeLabel = computed(() => {
  const archetypeKey = tournamentStore.currentOpponent?.archetypeKey;
  const labelKey =
    typeof archetypeKey === "string" && archetypeKey.length > 0
      ? `opponent.archetype.${archetypeKey}.label`
      : "";

  if (labelKey && te(labelKey)) {
    return t(labelKey);
  }

  return t("game.opponentSubtitle");
});

const opponentIntroText = computed(() => {
  const introKey = tournamentStore.currentOpponent?.opponentIntroKey;

  if (typeof introKey === "string" && introKey.length > 0 && te(introKey)) {
    return t(introKey);
  }

  return "";
});
</script>
