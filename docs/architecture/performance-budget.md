# Performance Budget and Build Gate

Date: 2026-04-05
Status: active

## Goal

Define a practical performance budget for release readiness and enforce it in CI.

## Current Budget (Build Asset Level)

1. Total JavaScript: <= 500 KB
2. Total CSS: <= 180 KB
3. Largest JavaScript chunk: <= 500 KB
4. Total build assets: <= 2500 KB

These are baseline targets for current project scope. They should be tightened gradually as optimization work progresses.

## Enforcement

Local commands:

1. `npm run build`
2. `npm run perf:bundle-check`
3. `npm run perf:ci` (build + check)

CI command:

1. `npm run perf:ci` in quality workflow

Gate behavior:

- If any metric exceeds budget, command exits with non-zero status and CI fails.

## Why This Budget Exists

1. Prevent silent bundle growth while features are added.
2. Keep load and parse costs under control on mid/low-end mobile devices.
3. Add measurable engineering signal for medior/senior portfolio quality.

## Next Iteration Plan

1. Add route-level chunk budgets when route splitting is stabilized.
2. Add runtime metrics (LCP/TTI/FID proxies) to complement build-size budget.
3. Tighten JS/CSS budgets after view and style refactors.
