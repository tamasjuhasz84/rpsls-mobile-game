<template>
  <article class="bracket-node" :class="statusClass">
    <div class="bracket-node-top">
      <p class="bracket-node-index">#{{ index + 1 }}</p>
      <span class="bracket-node-status">{{ statusText }}</span>
    </div>

    <h3 class="bracket-node-name" :title="node.name">
      {{ node.name }}
    </h3>
  </article>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const { t } = useI18n();

const status = computed(() => props.node.status || "pending");
const justBecameCurrent = ref(false);
let currentRevealTimeout = null;

function clearCurrentRevealTimeout() {
  if (!currentRevealTimeout) return;

  window.clearTimeout(currentRevealTimeout);
  currentRevealTimeout = null;
}

const statusClass = computed(() => {
  return [
    `is-${status.value}`,
    {
      "is-just-current": justBecameCurrent.value,
    },
  ];
});

const statusText = computed(() => {
  if (props.node.status === "current") return t("bracket.statusCurrent");
  if (props.node.status === "defeated") return t("bracket.statusDefeated");
  if (props.node.status === "lost") return t("bracket.statusLost");
  return t("bracket.statusPending");
});

watch(status, (nextStatus, previousStatus) => {
  if (
    nextStatus === "current" &&
    previousStatus &&
    previousStatus !== "current"
  ) {
    justBecameCurrent.value = true;
    clearCurrentRevealTimeout();
    currentRevealTimeout = window.setTimeout(() => {
      justBecameCurrent.value = false;
      currentRevealTimeout = null;
    }, 600);
    return;
  }

  if (nextStatus !== "current") {
    justBecameCurrent.value = false;
    clearCurrentRevealTimeout();
  }
});

onBeforeUnmount(() => {
  clearCurrentRevealTimeout();
});
</script>
