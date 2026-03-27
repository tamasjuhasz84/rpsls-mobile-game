import { createI18n } from "vue-i18n";
import hu from "./locales/hu.json";
import en from "./locales/en.json";

const i18n = createI18n({
  legacy: false,
  locale: "hu",
  fallbackLocale: "en",
  messages: {
    hu,
    en,
  },
});

export default i18n;
