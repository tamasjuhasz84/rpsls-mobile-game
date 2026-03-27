function canVibrate() {
  return (
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function"
  );
}

export function useHaptics() {
  function vibrate(pattern, enabled = true) {
    if (!enabled) return false;
    if (!canVibrate()) return false;

    try {
      return navigator.vibrate(pattern);
    } catch (error) {
      return false;
    }
  }

  function tap(enabled = true) {
    return vibrate(12, enabled);
  }

  function urgency(enabled = true) {
    return vibrate([16, 28, 16], enabled);
  }

  function reveal(enabled = true) {
    return vibrate(22, enabled);
  }

  function win(enabled = true) {
    return vibrate([20, 26, 30], enabled);
  }

  function lose(enabled = true) {
    return vibrate([36, 20, 18, 18, 18], enabled);
  }

  return {
    vibrate,
    tap,
    urgency,
    reveal,
    win,
    lose,
  };
}
