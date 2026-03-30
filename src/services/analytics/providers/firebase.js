import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function createFirebaseProvider() {
  let analytics = null;

  return {
    name: "firebase",
    isConfigured() {
      const config = getFirebaseConfig();
      return Object.values(config).every(isNonEmptyString);
    },
    init() {
      if (typeof window === "undefined") return false;
      if (!this.isConfigured()) return false;

      try {
        const config = getFirebaseConfig();
        const app = getApps()[0] || initializeApp(config);
        analytics = getAnalytics(app);
        return true;
      } catch (_error) {
        analytics = null;
        return false;
      }
    },
    trackEvent(eventName, params = {}) {
      if (!analytics) return;
      logEvent(analytics, eventName, params);
    },
  };
}
