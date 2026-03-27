<template>
  <section class="panel tournament-bracket">
    <div class="bracket-header">
      <p class="section-label">{{ t("bracket.title") }}</p>
      <span class="bracket-count">
        {{ tournamentStore.bracket.length }} {{ bracketCountLabel }}
      </span>
    </div>

    <div class="bracket-list">
      <BracketNode
        v-for="(node, index) in tournamentStore.bracket"
        :key="node.id"
        :node="node"
        :index="index"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTournamentStore } from "@/stores/tournament";
import BracketNode from "@/components/tournament/BracketNode.vue";

const { t } = useI18n();
const tournamentStore = useTournamentStore();

const bracketCountLabel = computed(() => {
  const count = tournamentStore.bracket.length;

  if (count === 1) return t("bracket.countSingle");
  return t("bracket.countPlural");
});
</script>
