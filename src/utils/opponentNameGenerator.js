const TITLES = [
  "Captain",
  "Doctor",
  "Master",
  "Lord",
  "Agent",
  "Professor",
  "Commander",
  "Sergeant",
  "Admiral",
];

const THEMES = [
  "Rock",
  "Paper",
  "Scissors",
  "Lizard",
  "Spock",
  "Meteor",
  "Nebula",
  "Plasma",
  "Quasar",
  "Void",
];

const SUFFIXES = [
  "Face",
  "Storm",
  "Wizard",
  "Crusher",
  "McHand",
  "Prime",
  "Blade",
  "Fist",
  "Zero",
  "Rex",
];

const ARCHETYPE_NAME_POOLS = {
  rookieBluffer: {
    titles: ["Rookie", "Cadet", "Scout", "Junior", "Pilot"],
    themes: ["Spark", "Pebble", "Trick", "Echo", "Comet"],
    suffixes: ["Dash", "Blink", "Step", "Feint", "Flip"],
  },
  patternHunter: {
    titles: ["Detective", "Analyst", "Professor", "Hunter", "Cipher"],
    themes: ["Pattern", "Script", "Signal", "Grid", "Logic"],
    suffixes: ["Scope", "Trace", "Lens", "Index", "Map"],
  },
  signalReader: {
    titles: ["Oracle", "Agent", "Reader", "Watcher", "Seer"],
    themes: ["Pulse", "Vector", "Radar", "Tempo", "Orbit"],
    suffixes: ["Mark", "Lock", "Shift", "Cross", "Node"],
  },
  momentumBreaker: {
    titles: ["Crusher", "Breaker", "Warden", "Captain", "Marshal"],
    themes: ["Anchor", "Brake", "Wall", "Gravity", "Hammer"],
    suffixes: ["Hold", "Clamp", "Stop", "Guard", "Line"],
  },
  wildCard: {
    titles: ["Joker", "Nomad", "Rogue", "Chaos", "Drifter"],
    themes: ["Vortex", "Glitch", "Prism", "Nova", "Mirage"],
    suffixes: ["Flux", "Spark", "Spin", "Zero", "Bloom"],
  },
  grandmaster: {
    titles: ["Grandmaster", "Overseer", "Admiral", "Archon", "Sovereign"],
    themes: ["Axiom", "Titan", "Monolith", "Crown", "Prime"],
    suffixes: ["Omega", "Core", "Matrix", "Crest", "Final"],
  },
};

function randomFrom(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function seededFrom(list, seed) {
  const safeSeed = Number.isFinite(Number(seed))
    ? Math.abs(Math.floor(Number(seed)))
    : 0;
  return list[safeSeed % list.length];
}

function hashTextSeed(value) {
  const text = String(value || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getNamePools(options = {}) {
  if (!options || typeof options !== "object") {
    return {
      titles: TITLES,
      themes: THEMES,
      suffixes: SUFFIXES,
      archetypeOffset: 0,
    };
  }

  const archetypeKey =
    typeof options.archetypeKey === "string" ? options.archetypeKey : "";
  const pools = ARCHETYPE_NAME_POOLS[archetypeKey];

  if (!pools) {
    return {
      titles: TITLES,
      themes: THEMES,
      suffixes: SUFFIXES,
      archetypeOffset: 0,
    };
  }

  return {
    titles: pools.titles,
    themes: pools.themes,
    suffixes: pools.suffixes,
    archetypeOffset: hashTextSeed(archetypeKey),
  };
}

export function generateOpponentName(options = {}) {
  const { titles, themes, suffixes } = getNamePools(options);
  return `${randomFrom(titles)} ${randomFrom(themes)} ${randomFrom(suffixes)}`;
}

export function generateSeededOpponentName(seed, options = {}) {
  const { titles, themes, suffixes, archetypeOffset } = getNamePools(options);

  return [
    seededFrom(titles, seed + archetypeOffset),
    seededFrom(themes, seed * 7 + 3 + archetypeOffset),
    seededFrom(suffixes, seed * 13 + 5 + archetypeOffset),
  ].join(" ");
}
