<template>
  <section class="result-cards">
    <PentagonCard owner="player" :move="playerMove" />

    <div class="result-cards-versus">{{ t("common.versus") }}</div>

    <PentagonCard owner="ai" :move="aiMove" />
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import PentagonCard from "@/components/game/PentagonCard.vue";

defineProps({
  playerMove: {
    type: String,
    default: "",
  },
  aiMove: {
    type: String,
    default: "",
  },
});

const { t } = useI18n();
</script>
