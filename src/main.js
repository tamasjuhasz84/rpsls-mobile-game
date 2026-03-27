import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { loadLanguage, loadUiState, loadStats } from "./utils/storage";
import { useUiStore } from "./stores/ui";
import { useStatsStore } from "./stores/stats";
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

registerSW({ immediate: true });

app.mount("#app");
