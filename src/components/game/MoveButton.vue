<template>
  <button
    class="move-button"
    :class="buttonClasses"
    type="button"
    :disabled="disabled"
    :aria-label="move.label"
    :aria-pressed="selected"
    @click="$emit('select', move.value)"
  >
    <span class="move-button-icon">
      <img
        v-if="move.asset && !imageFailed"
        :src="move.asset"
        alt=""
        class="move-button-icon-image"
        @error="imageFailed = true"
      />
      <span v-else>{{ move.icon }}</span>
    </span>

    <span class="move-button-text">{{ move.label }}</span>
  </button>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  move: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  locked: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const imageFailed = ref(false);

watch(
  () => props.move.asset,
  () => {
    imageFailed.value = false;
  },
  { immediate: true }
);

const buttonClasses = computed(() => ({
  active: props.selected,
  locked: props.locked,
  disabled: props.disabled,
}));
</script>
