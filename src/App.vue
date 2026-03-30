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

    <router-view v-else />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();
const { t } = useI18n();

function reloadApp() {
  uiStore.clearFatalError();
  window.location.reload();
}
</script>
