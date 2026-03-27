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

export function generateOpponentName() {
  return `${randomFrom(TITLES)} ${randomFrom(THEMES)} ${randomFrom(SUFFIXES)}`;
}
