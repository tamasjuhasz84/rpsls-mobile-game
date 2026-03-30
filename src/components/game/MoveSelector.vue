<template>
  <aside class="panel move-selector">
    <div class="move-selector-header">
      <p class="section-label">{{ t("game.moves") }}</p>
      <span class="move-selector-status">
        {{ statusText }}
      </span>
    </div>

    <div class="move-list">
      <MoveButton
        v-for="move in moveOptions"
        :key="move.value"
        :move="move"
        :selected="gameStore.currentMove === move.value"
        :disabled="!gameStore.isCountdownPhase"
        :locked="
          gameStore.lockedMove === move.value && !gameStore.isCountdownPhase
        "
        @select="handleSelect"
      />
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { useUiStore } from "@/stores/ui";
import { useFeedbackAudio } from "@/composables/useFeedbackAudio";
import { useHaptics } from "@/composables/useHaptics";
import { getMoveOptions } from "@/utils/gameRules";
import { getMoveAsset } from "@/utils/moveAssets";
import MoveButton from "@/components/game/MoveButton.vue";

const { t } = useI18n();
const gameStore = useGameStore();
const uiStore = useUiStore();
const { play } = useFeedbackAudio();
const { tap } = useHaptics();

const moveOptions = computed(() => {
  return getMoveOptions(uiStore.locale).map((move) => ({
    ...move,
    asset: getMoveAsset(move.value),
  }));
});

const statusText = computed(() => {
  if (gameStore.isCountdownPhase) return t("game.selectNow");
  if (gameStore.isLockedPhase) return t("game.selectionLocked");
  if (gameStore.isRevealPhase) return t("game.revealing");
  if (gameStore.isResultPhase) return t("game.roundFinished");
  return t("game.waiting");
});

function handleSelect(move) {
  const previousMove = gameStore.currentMove;
  gameStore.selectMove(move);

  if (gameStore.currentMove === previousMove) return;

  play("select", uiStore.soundEnabled);
  tap(uiStore.hapticsEnabled);
}
</script>
