import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import { Capacitor } from "@capacitor/core";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { loadLanguage, loadUiState, loadStats } from "./utils/storage";
import {
  parseFeatureFlagOverridesFromSearch,
  summarizeFeatureFlags,
} from "./utils/featureFlags";
import { useUiStore } from "./stores/ui";
import { useStatsStore } from "./stores/stats";
import { useLeaderboardStore } from "./stores/leaderboard";
import { useTournamentStore } from "./stores/tournament";
import {
  initAnalytics,
  trackEvent,
  trackScreen,
  getSessionId,
} from "./services/analytics";
import { initMonitoring, captureException } from "./services/monitoring";
import "./styles/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

const uiStore = useUiStore();
uiStore.hydrateFromStorage(loadUiState() || {});

const runtimeFeatureFlagOverrides =
  typeof window !== "undefined" && import.meta.env.DEV
    ? parseFeatureFlagOverridesFromSearch(window.location.search)
    : {};

uiStore.applyRuntimeFeatureFlagOverrides(runtimeFeatureFlagOverrides);

const statsStore = useStatsStore();
statsStore.hydrateFromStorage(loadStats() || {});

const leaderboardStore = useLeaderboardStore();
leaderboardStore.hydrateToday();

const tournamentStore = useTournamentStore();

const savedLang = loadLanguage() || uiStore.locale || "hu";
uiStore.setLocale(savedLang);
i18n.global.locale.value = uiStore.locale;

const analyticsRuntime = initAnalytics({
  getLocale: () => uiStore.locale,
});

const monitoringRuntime = initMonitoring({
  app,
});

trackEvent("app_start", {
  provider: analyticsRuntime.providerName,
  monitoring_backend: monitoringRuntime.backend,
  platform: monitoringRuntime.platform,
  feature_flags: summarizeFeatureFlags(uiStore.activeFeatureFlags),
});

if (Object.keys(runtimeFeatureFlagOverrides).length > 0) {
  trackEvent("feature_flags_override_applied", {
    source: "query_param",
    override_keys: Object.keys(runtimeFeatureFlagOverrides).join(","),
    feature_flags: summarizeFeatureFlags(uiStore.activeFeatureFlags),
  });
}

function reportFatalError(errorLike, source, extra = {}) {
  const normalizedError = captureException(errorLike, {
    tags: {
      source,
    },
    extra,
  });

  trackEvent("error_captured", {
    source,
    monitoring_backend: monitoringRuntime.backend,
    platform: monitoringRuntime.platform,
    session_id: getSessionId(),
    message: normalizedError.message,
  });

  uiStore.setFatalError({ source });
}

app.config.errorHandler = (error, _instance, info) => {
  reportFatalError(error, "vue_error", { info });
};

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (event?.error) {
      reportFatalError(event.error, "window_error", {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      return;
    }

    reportFatalError(event?.message || "Unknown window error", "window_error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportFatalError(
      event?.reason || "Unhandled rejection",
      "promise_rejection"
    );
  });

  if (import.meta.env.DEV) {
    window.__RPSLS_TEST_CRASH__ = () => {
      throw new Error("RPSLS test crash");
    };
  }
}

let initialScreenTracked = false;

router.afterEach((to, from) => {
  initialScreenTracked = true;

  const screenName = String(to?.name || to?.path || "unknown");
  const fromRoute = String(from?.name || from?.path || "direct");

  trackScreen(screenName, {
    from_route: fromRoute,
  });
});

router.isReady().then(() => {
  if (initialScreenTracked) return;

  const current = router.currentRoute.value;
  const screenName = String(current?.name || current?.path || "unknown");

  trackScreen(screenName, {
    from_route: "app_start",
  });
});

async function initNativeBackButtonHandling() {
  if (typeof window === "undefined") return;
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { App: CapacitorApp } = await import("@capacitor/app");

    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      const currentPath = router.currentRoute.value?.path || "/";
      const isActiveGame =
        currentPath === "/game" &&
        tournamentStore.bracket.length > 0 &&
        !tournamentStore.tournamentFinished;

      if (isActiveGame) {
        return;
      }

      if (canGoBack) {
        router.back();
        return;
      }

      if (currentPath !== "/") {
        router.replace("/");
        return;
      }

      const shouldExit = window.confirm(i18n.global.t("app.exitConfirm"));
      if (shouldExit) {
        CapacitorApp.exitApp();
      }
    });
  } catch (error) {
    captureException(error, {
      tags: {
        source: "native_back_button_init",
      },
    });
  }
}

initNativeBackButtonHandling();

async function cleanupNativeServiceWorkerState() {
  if (typeof window === "undefined") return;
  if (!Capacitor.isNativePlatform()) return;
  if (!("serviceWorker" in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );

    if (typeof caches !== "undefined") {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch (error) {
    captureException(error, {
      tags: {
        source: "native_service_worker_cleanup",
      },
    });
  }
}

if (Capacitor.isNativePlatform()) {
  cleanupNativeServiceWorkerState();
} else {
  registerSW({ immediate: true });
}

app.mount("#app");
