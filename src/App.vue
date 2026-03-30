<template>
  <div class="app-shell">
    <main v-if="uiStore.hasFatalError" class="screen fallback-screen">
      <section class="panel fallback-panel" role="alert">
        <h1>{{ t("error.fallbackTitle") }}</h1>
        <p>{{ t("error.fallbackMessage") }}</p>

        <button class="primary-button" type="button" @click="reloadApp">
          {{ t("error.reload") }}
        </button>
      </section>
    </main>

    <template v-else>
      <router-view />
      <TutorialOverlay
        v-if="
          uiStore.isFeatureEnabled('tutorialOverlay') && tutorialStore.isActive
        "
      />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui";
import { useTutorialStore } from "@/stores/tutorial";
import TutorialOverlay from "@/components/ui/TutorialOverlay.vue";

const uiStore = useUiStore();
const tutorialStore = useTutorialStore();
const { t } = useI18n();

onMounted(() => {
  if (uiStore.isFeatureEnabled("tutorialOverlay")) {
    tutorialStore.init();
  }
});

function reloadApp() {
  uiStore.clearFatalError();
  window.location.reload();
}
</script>
