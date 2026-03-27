const AUDIO_ASSETS = {
  select: "",
  countdown: "",
  reveal: "",
  win: "",
  lose: "",
  draw: "",
  toggle: "",
};

let sharedAudioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  if (!sharedAudioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;

    try {
      sharedAudioContext = new AudioContextCtor();
    } catch (error) {
      return null;
    }
  }

  return sharedAudioContext;
}

function playAssetCue(name) {
  const src = AUDIO_ASSETS[name];
  if (!src) return Promise.resolve(false);

  try {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0.65;

    return audio
      .play()
      .then(() => true)
      .catch(() => false);
  } catch (error) {
    return Promise.resolve(false);
  }
}

function playToneSequence(steps) {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }

  const now = context.currentTime;

  steps.forEach((step, index) => {
    const offset = steps
      .slice(0, index)
      .reduce((acc, item) => acc + item.duration + (item.gap || 0), 0);
    const startAt = now + offset;
    const endAt = startAt + step.duration;

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = step.type || "sine";
    oscillator.frequency.setValueAtTime(step.frequency, startAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(step.volume || 0.06, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(startAt);
    oscillator.stop(endAt);
  });
}

function getCueByName(name) {
  if (name === "select") {
    return [
      { frequency: 560, duration: 0.045, type: "triangle", volume: 0.05 },
    ];
  }

  if (name === "countdown") {
    return [{ frequency: 420, duration: 0.04, type: "square", volume: 0.04 }];
  }

  if (name === "reveal") {
    return [
      { frequency: 470, duration: 0.05, type: "triangle", volume: 0.045 },
      {
        frequency: 680,
        duration: 0.06,
        type: "triangle",
        volume: 0.05,
        gap: 0.02,
      },
    ];
  }

  if (name === "win") {
    return [
      { frequency: 620, duration: 0.07, type: "sine", volume: 0.05 },
      { frequency: 780, duration: 0.08, type: "sine", volume: 0.05, gap: 0.02 },
    ];
  }

  if (name === "lose") {
    return [
      { frequency: 440, duration: 0.07, type: "sine", volume: 0.045 },
      {
        frequency: 300,
        duration: 0.08,
        type: "sine",
        volume: 0.045,
        gap: 0.02,
      },
    ];
  }

  if (name === "draw") {
    return [
      { frequency: 520, duration: 0.055, type: "triangle", volume: 0.045 },
      {
        frequency: 520,
        duration: 0.055,
        type: "triangle",
        volume: 0.045,
        gap: 0.018,
      },
    ];
  }

  if (name === "toggle") {
    return [
      { frequency: 660, duration: 0.04, type: "triangle", volume: 0.045 },
    ];
  }

  return [];
}

export function useFeedbackAudio() {
  function play(name, enabled = true) {
    if (!enabled) return;

    playAssetCue(name).then((played) => {
      if (played) return;

      const cue = getCueByName(name);
      if (!cue.length) return;
      playToneSequence(cue);
    });
  }

  return {
    play,
  };
}
