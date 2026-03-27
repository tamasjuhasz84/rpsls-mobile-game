import { ref, onBeforeUnmount } from "vue";

export function useCountdown() {
  const intervalId = ref(null);

  function start(callback, delay = 1000) {
    stop();

    intervalId.value = window.setInterval(() => {
      callback();
    }, delay);
  }

  function stop() {
    if (intervalId.value !== null) {
      window.clearInterval(intervalId.value);
      intervalId.value = null;
    }
  }

  onBeforeUnmount(() => {
    stop();
  });

  return {
    start,
    stop,
  };
}
