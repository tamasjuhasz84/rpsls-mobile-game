export function createConsoleProvider() {
  return {
    name: "console",
    isConfigured: () => true,
    init: () => true,
    trackEvent(eventName, params = {}) {
      console.info("[analytics:console]", eventName, params);
    },
  };
}
