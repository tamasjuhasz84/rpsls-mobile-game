<template>
  <article class="pentagon-card" :class="[ownerClass, revealClass]">
    <div class="pentagon-card-shape">
      <div class="pentagon-card-content">
        <p class="pentagon-card-owner">{{ ownerLabel }}</p>

        <div class="pentagon-card-icon">
          <img
            v-if="asset"
            :src="asset"
            :alt="label"
            class="pentagon-card-icon-image"
            @error="imageFailed = true"
          />
          <span v-else>{{ icon }}</span>
        </div>

        <h3 class="pentagon-card-title">{{ label }}</h3>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useUiStore } from "@/stores/ui";
import { useI18n } from "vue-i18n";
import { getMoveIcon, getMoveLabel } from "@/utils/gameRules";
import { getMoveAsset } from "@/utils/moveAssets";

const props = defineProps({
  move: {
    type: String,
    default: "",
  },
  owner: {
    type: String,
    default: "player",
  },
});

const uiStore = useUiStore();
const { t } = useI18n();
const imageFailed = ref(false);

watch(
  () => props.move,
  () => {
    imageFailed.value = false;
  },
  { immediate: true }
);

const icon = computed(() => {
  if (!props.move) return "❔";
  return getMoveIcon(props.move);
});

const asset = computed(() => {
  if (!props.move || imageFailed.value) return "";
  return getMoveAsset(props.move);
});

const label = computed(() => {
  if (!props.move) return "—";
  return getMoveLabel(props.move, uiStore.locale);
});

const ownerClass = computed(() => {
  return props.owner === "ai" ? "is-ai" : "is-player";
});

const revealClass = computed(() => {
  return props.move ? "is-revealed" : "is-hidden";
});

const ownerLabel = computed(() => {
  if (props.owner === "ai") return t("game.ai");
  return uiStore.playerName || t("game.player");
});
</script>
