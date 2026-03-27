<template>
  <section class="panel game-board">
    <CountdownDisplay
      v-if="gameStore.isCountdownPhase || gameStore.isLockedPhase"
      :value="gameStore.countdown"
      :locale="uiStore.locale"
    />

    <div v-else-if="gameStore.isRevealPhase" class="result-state is-reveal">
      <ResultCards
        :player-move="gameStore.lockedMove"
        :ai-move="gameStore.aiMove"
      />
    </div>

    <div
      v-else-if="gameStore.isResultPhase"
      class="result-state"
      :class="resultStateClass"
    >
      <ResultCards
        :player-move="gameStore.lockedMove"
        :ai-move="gameStore.aiMove"
      />

      <p class="result-text" :class="resultTextClass">{{ resultText }}</p>
      <p class="result-explanation">{{ explanationText }}</p>
    </div>

    <div v-else class="countdown-placeholder">
      <span class="countdown-number">5</span>
      <p class="countdown-label">{{ t("common.ready") }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { useUiStore } from "@/stores/ui";
import CountdownDisplay from "@/components/game/CountdownDisplay.vue";
import ResultCards from "@/components/game/ResultCards.vue";

const gameStore = useGameStore();
const uiStore = useUiStore();
const { t } = useI18n();

const resultText = computed(() => {
  if (gameStore.result === "player") return t("result.win");
  if (gameStore.result === "ai") return t("result.lose");
  if (gameStore.result === "draw") return t("result.draw");
  return "";
});

const explanationText = computed(() => {
  if (!gameStore.explanationKey) return "";
  return t(gameStore.explanationKey);
});

const resultStateClass = computed(() => {
  return {
    "is-win": gameStore.result === "player",
    "is-lose": gameStore.result === "ai",
    "is-draw": gameStore.result === "draw",
  };
});

const resultTextClass = computed(() => {
  if (gameStore.result === "player") return "is-win";
  if (gameStore.result === "ai") return "is-lose";
  if (gameStore.result === "draw") return "is-draw";
  return "";
});
</script>
