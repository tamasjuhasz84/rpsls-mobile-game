# Day 38 - Accessibility Checklist and Manual Audit (Top 5 Screens)

Date: 2026-04-05
Scope: Manual a11y baseline audit for primary user-facing routes

## Checklist

### Semantics and structure

1. Main regions and headings are present and meaningful.
2. Interactive elements use semantic controls (`button`, links, form fields).
3. Labels are present for user input fields.

### Keyboard

1. All primary actions are keyboard reachable.
2. Focus order is logical on each screen.
3. Visible focus indicator exists on interactive controls.

### Screen reader and ARIA

1. Buttons have accessible names.
2. Dynamic status areas use `aria-live` where relevant.
3. Toggle controls reflect state with `aria-pressed` or equivalent.

### Visual and readability

1. Text contrast is acceptable for primary UI and actionable controls.
2. Content remains usable on mobile viewport widths.
3. Long text does not overflow critical UI containers.

## Manual Audit Results

### 1) Home (`/`)

Status: Pass with minor improvements

Findings:
1. Player name input has explicit label.
2. Mode buttons expose pressed state.
3. Expand/collapse sections expose `aria-expanded`.

Minor improvements:
1. Add skip-link for faster keyboard navigation to primary actions.
2. Add explicit landmark labels for secondary content panels.

### 2) Game (`/game`)

Status: Pass with medium-priority improvements

Findings:
1. Match and share statuses use `aria-live` in key sections.
2. Move selection controls are keyboard accessible.
3. Top bar actions provide accessible names.

Medium-priority improvements:
1. Ensure round lifecycle announcements are concise and non-repetitive for screen reader users.
2. Add testable data attributes for stable automated a11y checks.

### 3) Bracket (`/bracket`)

Status: Pass

Findings:
1. Summary and navigation controls are semantic.
2. Back action is keyboard accessible.

Improvement:
1. Validate bracket node semantics for assistive tech when bracket complexity grows.

### 4) Rules (`/rules`)

Status: Pass

Findings:
1. Content is text-oriented and semantically simple.
2. Navigation path is clear.

Improvement:
1. Add section anchors for rapid keyboard/screen reader navigation in long content.

### 5) Privacy (`/privacy`)

Status: Pass

Findings:
1. Legal text structure is readable and route is keyboard accessible.
2. No complex interaction blockers found.

Improvement:
1. Ensure legal sections use consistent heading hierarchy.

## Overall Result

Current baseline: acceptable for portfolio production quality.

Priority follow-ups:
1. Add skip-link on Home and Game pages.
2. Add automated accessibility smoke checks to CI (next phase).
3. Add dedicated keyboard-navigation regression checklist for release reviews.
