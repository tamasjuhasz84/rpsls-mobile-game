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
const { t } = useI18n();

function resolveI18nValue(key, fallback = "") {
  if (typeof key !== "string" || key.length === 0) return fallback;

  const translated = t(key);
  return translated === key ? fallback : translated;
}

const opponentName = computed(() => {
  return tournamentStore.currentOpponent?.name || t("opponent.fallback");
});

const archetypeLabel = computed(() => {
  const archetypeKey = tournamentStore.currentOpponent?.archetypeKey;
  const labelKey =
    typeof archetypeKey === "string" && archetypeKey.length > 0
      ? `opponent.archetype.${archetypeKey}.label`
      : "";

  return resolveI18nValue(labelKey, t("game.opponentSubtitle"));
});

const opponentIntroText = computed(() => {
  const introKey = tournamentStore.currentOpponent?.opponentIntroKey;

  return resolveI18nValue(introKey, "");
});
</script>
