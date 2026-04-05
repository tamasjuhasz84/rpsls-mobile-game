import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  consoleTrackEvent,
  consoleInit,
  firebaseTrackEvent,
  firebaseInit,
  firebaseState,
} = vi.hoisted(() => ({
  consoleTrackEvent: vi.fn(),
  consoleInit: vi.fn(),
  firebaseTrackEvent: vi.fn(),
  firebaseInit: vi.fn(() => false),
  firebaseState: {
    isConfigured: false,
    initResult: false,
  },
}));

vi.mock("@/services/analytics/providers/console", () => ({
  createConsoleProvider: vi.fn(() => ({
    name: "console",
    init: consoleInit,
    trackEvent: consoleTrackEvent,
  })),
}));

vi.mock("@/services/analytics/providers/firebase", () => ({
  createFirebaseProvider: vi.fn(() => ({
    name: "firebase",
    isConfigured: () => firebaseState.isConfigured,
    init: () => {
      firebaseInit();
      return firebaseState.initResult;
    },
    trackEvent: firebaseTrackEvent,
  })),
}));

import { initAnalytics, trackEvent, trackScreen } from "@/services/analytics";

describe("analytics payload validation", () => {
  beforeEach(() => {
    consoleTrackEvent.mockClear();
    consoleInit.mockClear();
    firebaseTrackEvent.mockClear();
    firebaseInit.mockClear();
    firebaseState.isConfigured = false;
    firebaseState.initResult = false;
  });

  it("drops continue_click when required mode is missing", () => {
    trackEvent("continue_click", {
      source_screen: "home",
    });

    expect(consoleTrackEvent).not.toHaveBeenCalled();
  });

  it("drops continue_click when mode is empty", () => {
    trackEvent("continue_click", {
      source_screen: "home",
      mode: "   ",
    });

    expect(consoleTrackEvent).not.toHaveBeenCalled();
  });

  it("drops screen_view when screen_name is empty", () => {
    trackScreen(" ");

    expect(consoleTrackEvent).not.toHaveBeenCalled();
  });

  it("tracks valid continue_click payload", () => {
    trackEvent("continue_click", {
      source_screen: "home",
      mode: "bo3",
      has_saved_tournament: true,
      action: "resume_standard_from_home",
    });

    expect(consoleTrackEvent).toHaveBeenCalledTimes(1);
    expect(consoleTrackEvent).toHaveBeenCalledWith("continue_click", {
      source_screen: "home",
      mode: "bo3",
      has_saved_tournament: true,
      action: "resume_standard_from_home",
      locale: "hu",
    });
  });

  it("tracks unknown events with sanitized payload", () => {
    trackEvent("custom_event", {
      foo: "bar",
      optional: undefined,
    });

    expect(consoleTrackEvent).toHaveBeenCalledTimes(1);
    expect(consoleTrackEvent).toHaveBeenCalledWith("custom_event", {
      foo: "bar",
      locale: "hu",
    });
  });
});

describe("analytics init provider selection", () => {
  beforeEach(() => {
    consoleTrackEvent.mockClear();
    consoleInit.mockClear();
    firebaseTrackEvent.mockClear();
    firebaseInit.mockClear();
    firebaseState.isConfigured = false;
    firebaseState.initResult = false;
  });

  it("falls back to console provider when firebase is not configured", () => {
    firebaseState.isConfigured = false;
    firebaseState.initResult = true;

    const runtime = initAnalytics({ getLocale: () => "en" });

    expect(runtime.providerName).toBe("console");
    expect(firebaseInit).not.toHaveBeenCalled();
    expect(consoleInit).toHaveBeenCalledTimes(1);
    expect(firebaseTrackEvent).not.toHaveBeenCalled();
    expect(consoleTrackEvent).toHaveBeenCalledTimes(1);
    expect(consoleTrackEvent).toHaveBeenCalledWith(
      "session_start",
      expect.objectContaining({
        locale: "en",
      })
    );
  });

  it("uses firebase provider when configured and initialized", () => {
    firebaseState.isConfigured = true;
    firebaseState.initResult = true;

    const runtime = initAnalytics({ getLocale: () => "en" });

    expect(runtime.providerName).toBe("firebase");
    expect(consoleInit).not.toHaveBeenCalled();
    expect(consoleTrackEvent).not.toHaveBeenCalled();
    expect(firebaseTrackEvent).toHaveBeenCalledTimes(1);
    expect(firebaseTrackEvent).toHaveBeenCalledWith(
      "session_start",
      expect.objectContaining({
        locale: "en",
      })
    );
  });

  it("falls back to console provider when firebase init fails", () => {
    firebaseState.isConfigured = true;
    firebaseState.initResult = false;

    const runtime = initAnalytics({ getLocale: () => "en" });

    expect(runtime.providerName).toBe("console");
    expect(consoleInit).toHaveBeenCalledTimes(1);
    expect(firebaseTrackEvent).not.toHaveBeenCalled();
    expect(consoleTrackEvent).toHaveBeenCalledTimes(1);
    expect(consoleTrackEvent).toHaveBeenCalledWith(
      "session_start",
      expect.objectContaining({
        locale: "en",
      })
    );
  });
});
