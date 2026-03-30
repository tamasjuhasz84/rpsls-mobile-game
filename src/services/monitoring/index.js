import * as Sentry from "@sentry/vue";
import { Capacitor } from "@capacitor/core";

let monitoringBackend = "console";
let monitoringPlatform = "web";
let sentryEnabled = false;

function resolvePlatform() {
  try {
    return Capacitor.getPlatform();
  } catch (_error) {
    return "web";
  }
}

function hasSentryDsn() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  return typeof dsn === "string" && dsn.trim().length > 0;
}

export function initMonitoring({ app } = {}) {
  monitoringPlatform = resolvePlatform();

  if (monitoringPlatform === "web" && hasSentryDsn() && app) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0,
    });
    sentryEnabled = true;
    monitoringBackend = "sentry";
  } else if (monitoringPlatform === "android") {
    monitoringBackend = "crashlytics_pending";
  } else {
    monitoringBackend = "console";
  }

  return {
    backend: monitoringBackend,
    platform: monitoringPlatform,
  };
}

function normalizeError(errorLike) {
  if (errorLike instanceof Error) return errorLike;

  if (typeof errorLike === "string") {
    return new Error(errorLike);
  }

  return new Error("Unknown runtime error");
}

export function captureException(errorLike, context = {}) {
  const error = normalizeError(errorLike);

  if (sentryEnabled) {
    Sentry.captureException(error, {
      tags: {
        platform: monitoringPlatform,
        backend: monitoringBackend,
        ...context.tags,
      },
      extra: context.extra,
    });
    return error;
  }

  console.error("[monitoring]", error, context);
  return error;
}
