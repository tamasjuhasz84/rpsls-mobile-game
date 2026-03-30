import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { loadLanguage, loadUiState, loadStats } from "./utils/storage";
import { useUiStore } from "./stores/ui";
import { useStatsStore } from "./stores/stats";
import { initAnalytics, trackEvent, trackScreen } from "./services/analytics";
import { initMonitoring, captureException } from "./services/monitoring";
import "./styles/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

const uiStore = useUiStore();
uiStore.hydrateFromStorage(loadUiState() || {});

const statsStore = useStatsStore();
statsStore.hydrateFromStorage(loadStats() || {});

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
});

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
      "promise_rejection",
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

registerSW({ immediate: true });

app.mount("#app");
