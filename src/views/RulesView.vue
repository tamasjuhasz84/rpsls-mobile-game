<template>
  <main class="screen rules-screen">
    <section class="panel rules-hero">
      <p class="section-label">{{ t("rules.label") }}</p>
      <h1>{{ t("rules.title") }}</h1>
      <p class="rules-intro">
        {{ t("rules.intro") }}
      </p>

      <RouterLink class="secondary-button inline-button" :to="backTarget">
        {{ backLabel }}
      </RouterLink>
    </section>

    <section class="panel rules-summary">
      <h2 class="rules-section-title">{{ t("rules.basicTitle") }}</h2>

      <ul class="rules-bullet-list">
        <li>{{ t("rules.basic1") }}</li>
        <li>{{ t("rules.basic2") }}</li>
        <li>{{ t("rules.basic3") }}</li>
      </ul>
    </section>

    <section class="panel rules-moves">
      <h2 class="rules-section-title">{{ t("rules.movesTitle") }}</h2>

      <div class="rules-move-grid">
        <article
          v-for="move in moveOptions"
          :key="move.value"
          class="rules-move-card"
        >
          <div class="rules-move-icon">
            <img
              v-if="move.asset"
              :src="move.asset"
              :alt="move.label"
              class="rules-move-icon-image"
            />
            <span v-else>{{ move.icon }}</span>
          </div>
          <h3 class="rules-move-name">{{ move.label }}</h3>
        </article>
      </div>
    </section>

    <section class="panel rules-matchups">
      <h2 class="rules-section-title">{{ t("rules.matchupsTitle") }}</h2>

      <div class="rules-matchup-list">
        <article
          v-for="rule in localizedRules"
          :key="rule.key"
          class="rules-matchup-card"
        >
          <div class="rules-matchup-top">
            <span class="rules-matchup-badge">
              <span class="rules-matchup-icon">
                <img
                  v-if="rule.winnerAsset"
                  :src="rule.winnerAsset"
                  :alt="rule.winnerLabel"
                  class="rules-matchup-icon-image"
                />
                <span v-else>{{ rule.winnerIcon }}</span>
              </span>
              {{ rule.winnerLabel }}
            </span>

            <span class="rules-matchup-arrow">→</span>

            <span class="rules-matchup-badge is-loser">
              <span class="rules-matchup-icon">
                <img
                  v-if="rule.loserAsset"
                  :src="rule.loserAsset"
                  :alt="rule.loserLabel"
                  class="rules-matchup-icon-image"
                />
                <span v-else>{{ rule.loserIcon }}</span>
              </span>
              {{ rule.loserLabel }}
            </span>
          </div>

          <p class="rules-matchup-text">
            {{ rule.text }}
          </p>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { getMoveAsset } from "@/utils/moveAssets";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui";
import {
  getMoveOptions,
  getMoveIcon,
  getMoveLabel,
  getRulePairs,
} from "@/utils/gameRules";

const route = useRoute();
const { t } = useI18n();
const uiStore = useUiStore();

const from = computed(() => {
  const rawFrom = route.query.from;
  if (Array.isArray(rawFrom)) return rawFrom[0] || "home";
  return rawFrom || "home";
});

const backTarget = computed(() => {
  return from.value === "game" ? "/game" : "/";
});

const backLabel = computed(() => {
  return from.value === "game" ? t("rules.backToGame") : t("rules.backToHome");
});

const moveOptions = computed(() => {
  return getMoveOptions(uiStore.locale).map((move) => ({
    ...move,
    asset: getMoveAsset(move.value),
  }));
});

const localizedRules = computed(() => {
  return getRulePairs().map((rule) => ({
    ...rule,
    winnerIcon: getMoveIcon(rule.winner),
    loserIcon: getMoveIcon(rule.loser),
    winnerAsset: getMoveAsset(rule.winner),
    loserAsset: getMoveAsset(rule.loser),
    winnerLabel: getMoveLabel(rule.winner, uiStore.locale),
    loserLabel: getMoveLabel(rule.loser, uiStore.locale),
    text: t(rule.key),
  }));
});
</script>
