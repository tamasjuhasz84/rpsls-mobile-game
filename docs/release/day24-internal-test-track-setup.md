# Day 24 - Internal Test Track Setup

Datum: 2026-03-30
Statusz: Draft v1
Target: Google Play Console - Internal testing

## 1. Goal

Signed AAB feltoltese internal test trackre gyors QA korhoz es early feedbackhez.

## 2. Preconditions

- Signed AAB available
- Privacy/compliance draft package present
- Store listing minimum assets prepared

References:

- docs/release/day21-privacy-policy-draft.md
- docs/release/day21-data-disclosure-matrix.md
- docs/release/day21-legal-todo.md
- docs/release/day23-play-console-asset-checklist.md

## 3. Console flow

1. Open Play Console -> app -> Testing -> Internal testing.
2. Create/choose release.
3. Upload AAB artifact.
4. Add release notes (HU or EN depending audience).
5. Save and review warnings/errors.
6. Roll out to internal test track.

## 4. Tester management

- Create tester email list (small, active QA pool).
- Use clear build label in communication:
  - versionName
  - versionCode
  - build date

## 5. Post-upload validation

- [ ] Build appears in internal track
- [ ] Test invite link works
- [ ] Install path works on at least 2 devices
- [ ] App startup and first match flow verified
- [ ] Crash monitoring baseline checked after first installs

## 6. Rollback readiness

- Keep previous good AAB metadata documented.
- If blocking issue appears, stop wider tester invite and prepare hotfix bump.
