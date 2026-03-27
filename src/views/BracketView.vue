<template>
  <main class="screen bracket-screen">
    <section class="panel bracket-summary">
      <p class="section-label">{{ t("bracket.summary") }}</p>
      <h1>{{ t("bracket.title") }}</h1>

      <p class="bracket-summary-text">
        {{ summaryText }}
      </p>

      <button
        class="secondary-button inline-button"
        type="button"
        @click="goBack"
      >
        {{ backLabel }}
      </button>
    </section>

    <TournamentBracket />
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useTournamentStore } from "@/stores/tournament";
import TournamentBracket from "@/components/tournament/TournamentBracket.vue";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const tournamentStore = useTournamentStore();

const fromSource = computed(() => {
  const rawFrom = route.query.from;

  if (Array.isArray(rawFrom)) {
    return rawFrom[0] || "home";
  }

  return rawFrom || "home";
});

const summaryText = computed(() => {
  if (tournamentStore.tournamentFinished && tournamentStore.tournamentLost) {
    return t("bracket.summaryLost");
  }

  if (tournamentStore.tournamentFinished && !tournamentStore.tournamentLost) {
    return t("bracket.summaryWon");
  }

  if (tournamentStore.currentOpponent?.name) {
    return `${t("bracket.currentOpponent")}: ${tournamentStore.currentOpponent.name}`;
  }

  return t("bracket.summaryEmpty");
});

const backLabel = computed(() => {
  return fromSource.value === "game"
    ? t("bracket.backToGame")
    : t("bracket.backToHome");
});

function goBack() {
  if (fromSource.value === "game") {
    router.push("/game");
    return;
  }

  router.push("/");
}
</script>
