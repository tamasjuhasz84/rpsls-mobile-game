<template>
  <header class="topbar panel">
    <RouterLink class="topbar-link" to="/">
      {{ t("nav.home") }}
    </RouterLink>

    <div class="topbar-actions">
      <button
        class="topbar-icon-button"
        type="button"
        :aria-label="t('settings.sound')"
        :aria-pressed="uiStore.soundEnabled"
        :title="t('settings.sound')"
        @click="toggleSound"
      >
        <img
          :src="uiStore.soundEnabled ? speakerOn : speakerOff"
          alt=""
          class="topbar-icon-image"
        />
      </button>

      <button
        class="topbar-icon-button"
        type="button"
        :aria-label="t('settings.haptics')"
        :aria-pressed="uiStore.hapticsEnabled"
        :title="t('settings.haptics')"
        @click="toggleHaptics"
      >
        <img
          :src="uiStore.hapticsEnabled ? vibrationOn : vibrationOff"
          alt=""
          class="topbar-icon-image"
        />
      </button>

      <RouterLink
        class="topbar-link"
        :to="{ path: '/rules', query: { from: 'game' } }"
      >
        {{ t("nav.rules") }}
      </RouterLink>

      <RouterLink
        class="topbar-link"
        :to="{ path: '/bracket', query: { from: 'game' } }"
      >
        {{ t("nav.bracket") }}
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui";
import { useFeedbackAudio } from "@/composables/useFeedbackAudio";
import speakerOn from "@/assets/icons/ui/speaker_on.svg";
import speakerOff from "@/assets/icons/ui/speaker_off.svg";
import vibrationOn from "@/assets/icons/ui/vibration_on.svg";
import vibrationOff from "@/assets/icons/ui/vibration_off.svg";

const uiStore = useUiStore();
const { t } = useI18n();
const { play } = useFeedbackAudio();

function toggleSound() {
  const nextEnabled = !uiStore.soundEnabled;
  uiStore.toggleSound();
  play("toggle", nextEnabled);
}

function toggleHaptics() {
  uiStore.toggleHaptics();
}
</script>
