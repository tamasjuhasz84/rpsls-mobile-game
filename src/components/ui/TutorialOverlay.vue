<template>
  <div
    class="tutorial-overlay"
    role="dialog"
    aria-modal="true"
    :aria-label="t('tutorial.label')"
  >
    <div class="tutorial-card">
      <div class="tutorial-dots" aria-hidden="true">
        <span
          v-for="index in tutorialStore.stepCount"
          :key="index"
          :class="[
            'tutorial-dot',
            index - 1 === tutorialStore.currentStep && 'is-active',
            index - 1 < tutorialStore.currentStep && 'is-done',
          ]"
        ></span>
      </div>

      <div class="tutorial-progress" :aria-label="t('tutorial.progress')">
        <div
          class="tutorial-progress-fill"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <transition name="tutorial-step" mode="out-in">
        <div :key="tutorialStore.currentStep" class="tutorial-step-content">
          <p class="tutorial-step-number">
            {{ tutorialStore.currentStep + 1 }} / {{ tutorialStore.stepCount }}
          </p>
          <h2 class="tutorial-step-title">{{ t(stepTitleKey) }}</h2>
          <p class="tutorial-step-body">{{ t(stepBodyKey) }}</p>
        </div>
      </transition>

      <div class="tutorial-actions">
        <button
          v-if="!tutorialStore.isLastStep"
          class="secondary-button tutorial-skip-button"
          type="button"
          @click="handleSkip"
        >
          {{ t("tutorial.skip") }}
        </button>

        <button
          class="primary-button tutorial-next-button"
          type="button"
          @click="handleNext"
        >
          {{
            tutorialStore.isLastStep ? t("tutorial.finish") : t("tutorial.next")
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useTutorialStore } from "@/stores/tutorial";
import { useUiStore } from "@/stores/ui";
import { useFeedbackAudio } from "@/composables/useFeedbackAudio";
import { useHaptics } from "@/composables/useHaptics";
import { trackEvent } from "@/services/analytics";

const { t } = useI18n();
const tutorialStore = useTutorialStore();
const uiStore = useUiStore();
const { play } = useFeedbackAudio();
const { tap, urgency, win } = useHaptics();

const stepTitleKey = computed(
  () => `tutorial.step${tutorialStore.currentStep}.title`
);
const stepBodyKey = computed(
  () => `tutorial.step${tutorialStore.currentStep}.body`
);
const progressPercent = computed(() => {
  const max = tutorialStore.stepCount - 1;
  if (max <= 0) return 100;
  return Math.round((tutorialStore.currentStep / max) * 100);
});

onMounted(() => {
  play("toggle", uiStore.soundEnabled);
  tap(uiStore.hapticsEnabled);

  trackEvent("tutorial_start", {
    step: 0,
    source_screen: "tutorial",
  });
});

function handleNext() {
  const step = tutorialStore.currentStep;
  const wasLast = tutorialStore.isLastStep;

  play(wasLast ? "win" : "select", uiStore.soundEnabled);
  tap(uiStore.hapticsEnabled);

  tutorialStore.advance();

  if (wasLast) {
    win(uiStore.hapticsEnabled);
    trackEvent("tutorial_complete", {
      steps_seen: step + 1,
      source_screen: "tutorial",
    });
  } else {
    trackEvent("tutorial_step", { step: step + 1 });
  }
}

function handleSkip() {
  const step = tutorialStore.currentStep;

  play("lose", uiStore.soundEnabled);
  urgency(uiStore.hapticsEnabled);

  tutorialStore.skip();
  trackEvent("tutorial_skip", {
    at_step: step,
    source_screen: "tutorial",
  });
}
</script>
