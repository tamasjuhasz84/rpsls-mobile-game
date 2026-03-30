import { describe, it, expect } from "vitest";
import { useTutorialStore, TUTORIAL_STEP_COUNT } from "@/stores/tutorial";
import { saveOnboardingState } from "@/utils/storage";

describe("tutorial store", () => {
  it("init() aktiválja a tutorialt új felhasználónak", () => {
    const store = useTutorialStore();
    const started = store.init();

    expect(started).toBe(true);
    expect(store.isActive).toBe(true);
    expect(store.currentStep).toBe(0);
  });

  it("init() nem indítja el a tutorialt ha már elvégezték", () => {
    saveOnboardingState({ completed: true, completedAt: Date.now() });

    const store = useTutorialStore();
    const started = store.init();

    expect(started).toBe(false);
    expect(store.isActive).toBe(false);
    expect(store.isDone).toBe(true);
  });

  it("advance() növeli a lépésszámot", () => {
    const store = useTutorialStore();
    store.init();

    store.advance();

    expect(store.currentStep).toBe(1);
    expect(store.isActive).toBe(true);
  });

  it("advance() az utolsó lépésen befejezi a tutorialt", () => {
    const store = useTutorialStore();
    store.init();

    for (let i = 0; i < TUTORIAL_STEP_COUNT - 1; i += 1) {
      store.advance();
    }
    expect(store.currentStep).toBe(TUTORIAL_STEP_COUNT - 1);
    expect(store.isLastStep).toBe(true);

    store.advance();

    expect(store.isDone).toBe(true);
    expect(store.isActive).toBe(false);
  });

  it("skip() azonnal befejezi a tutorialt", () => {
    const store = useTutorialStore();
    store.init();

    store.advance();
    const result = store.skip();

    expect(result).toBe(true);
    expect(store.isDone).toBe(true);
    expect(store.isActive).toBe(false);
  });

  it("skip() idempotens: befejezett tutorialon false-t ad", () => {
    const store = useTutorialStore();
    store.init();
    store.skip();

    const second = store.skip();

    expect(second).toBe(false);
  });

  it("befejezés után újra init() nem indítja el a tutorialt", () => {
    const store = useTutorialStore();
    store.init();
    store.skip();

    const secondStart = store.init();

    expect(secondStart).toBe(false);
    expect(store.isDone).toBe(true);
  });
});
