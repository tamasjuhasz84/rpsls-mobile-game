import { createConsoleProvider } from "./providers/console";
import { createFirebaseProvider } from "./providers/firebase";

const SESSION_ID_KEY = "rpsls_session_id";
const SESSION_STARTED_AT_KEY = "rpsls_session_started_at";

let provider = createConsoleProvider();
let providerName = "console";
let localeResolver = () => "hu";

const EVENT_REQUIRED_FIELDS = {
  screen_view: ["screen_name"],
  continue_click: ["source_screen", "mode"],
  match_start: ["mode"],
  match_end: ["mode", "result"],
  tournament_end: ["mode", "tournament_result"],
  daily_complete: ["daily_challenge_id", "mode", "result"],
};

const NON_EMPTY_FIELDS = ["mode", "result", "screen_name"];

function isBrowser() {
  return typeof window !== "undefined";
}

function sanitizeParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    acc[key] = value;
    return acc;
  }, {});
}

function isEmptyValue(value) {
  if (typeof value === "string") return value.trim().length === 0;
  return false;
}

function isPayloadValid(eventName, payload) {
  const requiredFields = EVENT_REQUIRED_FIELDS[eventName] || [];

  for (const field of requiredFields) {
    if (!(field in payload) || isEmptyValue(payload[field])) {
      return false;
    }
  }

  for (const field of NON_EMPTY_FIELDS) {
    if (field in payload && isEmptyValue(payload[field])) {
      return false;
    }
  }

  return true;
}

function shouldDebugLog() {
  return Boolean(import.meta.env.DEV) && import.meta.env.MODE !== "test";
}

function debugLog(eventName, payload) {
  if (!shouldDebugLog()) return;
  console.debug(`[analytics:${providerName}] ${eventName}`, payload);
}

function createSessionId() {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}_${randomPart}`;
}

export function getSessionId() {
  if (!isBrowser()) return "server";

  const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const nextId = createSessionId();
  window.sessionStorage.setItem(SESSION_ID_KEY, nextId);
  window.sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(Date.now()));
  return nextId;
}

function getSessionStartedAt() {
  if (!isBrowser()) return Date.now();

  const raw = window.sessionStorage.getItem(SESSION_STARTED_AT_KEY);
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  const now = Date.now();
  window.sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(now));
  return now;
}

export function initAnalytics({ getLocale } = {}) {
  if (typeof getLocale === "function") {
    localeResolver = getLocale;
  }

  const firebaseProvider = createFirebaseProvider();
  if (firebaseProvider.isConfigured() && firebaseProvider.init()) {
    provider = firebaseProvider;
    providerName = firebaseProvider.name;
  } else {
    provider = createConsoleProvider();
    providerName = "console";
    provider.init();
  }

  trackEvent("session_start", {
    session_id: getSessionId(),
    session_started_at: getSessionStartedAt(),
  });

  return {
    providerName,
  };
}

export function trackEvent(eventName, params = {}) {
  const payload = sanitizeParams({
    ...params,
    locale: localeResolver(),
  });

  if (!isPayloadValid(eventName, payload)) {
    debugLog(`${eventName}_dropped_invalid_payload`, payload);
    return;
  }

  provider.trackEvent(eventName, payload);
  debugLog(eventName, payload);
}

export function trackScreen(screenName, params = {}) {
  trackEvent("screen_view", {
    screen_name: screenName,
    ...params,
  });
}
