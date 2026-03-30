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

export function generateOpponentName() {
  return `${randomFrom(TITLES)} ${randomFrom(THEMES)} ${randomFrom(SUFFIXES)}`;
}

export function generateSeededOpponentName(seed) {
  return [
    seededFrom(TITLES, seed),
    seededFrom(THEMES, seed * 7 + 3),
    seededFrom(SUFFIXES, seed * 13 + 5),
  ].join(" ");
}
