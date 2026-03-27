<template>
  <div class="countdown-display" :class="countdownClasses">
    <span class="countdown-number">{{ value }}</span>
    <p class="countdown-label">{{ countdownLabel }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getCountdownLabel } from "@/utils/gameRules";

const props = defineProps({
  value: {
    type: Number,
    default: 5,
  },
  locale: {
    type: String,
    default: "hu",
  },
});

const countdownLabel = computed(() => {
  return getCountdownLabel(props.value, props.locale);
});

const countdownClasses = computed(() => ({
  "is-urgent": props.value <= 2 && props.value > 0,
}));
</script>
