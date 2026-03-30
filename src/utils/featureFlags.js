export const DEFAULT_FEATURE_FLAGS = Object.freeze({
  tutorialOverlay: true,
  dailyChallengePromo: true,
  matchEndMotivationPanel: true,
});

export const FEATURE_FLAG_QUERY_PARAM_MAP = Object.freeze({
  ff_tutorial: "tutorialOverlay",
  ff_daily_promo: "dailyChallengePromo",
  ff_match_panel: "matchEndMotivationPanel",
});

const ENABLED_FLAG_VALUES = new Set(["1", "true", "on", "enabled", "yes"]);
const DISABLED_FLAG_VALUES = new Set(["0", "false", "off", "disabled", "no"]);

export function normalizeFeatureFlags(payload = {}, options = {}) {
  const allowPartial = options.allowPartial === true;
  const normalized = allowPartial ? {} : { ...DEFAULT_FEATURE_FLAGS };

  if (!payload || typeof payload !== "object") {
    return normalized;
  }

  Object.keys(DEFAULT_FEATURE_FLAGS).forEach((key) => {
    if (typeof payload[key] === "boolean") {
      normalized[key] = payload[key];
    }
  });

  return normalized;
}

export function parseFeatureFlagOverridesFromSearch(search = "") {
  const source = typeof search === "string" ? search : "";
  const params = new URLSearchParams(
    source.startsWith("?") || source.length === 0 ? source : `?${source}`,
  );
  const overrides = {};

  Object.entries(FEATURE_FLAG_QUERY_PARAM_MAP).forEach(([param, flag]) => {
    if (!params.has(param)) return;

    const rawValue = String(params.get(param) || "")
      .trim()
      .toLowerCase();

    if (ENABLED_FLAG_VALUES.has(rawValue)) {
      overrides[flag] = true;
    }

    if (DISABLED_FLAG_VALUES.has(rawValue)) {
      overrides[flag] = false;
    }
  });

  return overrides;
}

export function summarizeFeatureFlags(flags = {}) {
  const resolved = normalizeFeatureFlags(flags);

  return Object.keys(DEFAULT_FEATURE_FLAGS)
    .map((key) => `${key}:${resolved[key] ? "on" : "off"}`)
    .join(",");
}
