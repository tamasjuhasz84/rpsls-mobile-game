# Day 25 - Play Console Upload Order

Datum: 2026-03-30
Statusz: Ready for execution
Target: Google Play Console internal testing

## 1. Pre-flight

- [ ] Confirm the signed artifact exists: android/app/build/outputs/bundle/release/app-release.aab
- [ ] Confirm version is still 0.1.0 / versionCode 1
- [ ] Confirm the upload key matches the Play Console expectation for this app
- [ ] Keep the release notes file open: docs/release/day29-release-note-v1.0.md
- [ ] Keep the QA matrix file open: docs/release/day25-pre-release-qa-matrix.md

## 2. Play Console upload order

1. Open Play Console and select the target app.
2. Go to Testing -> Internal testing.
3. Create a new release or open the current draft release.
4. Upload android/app/build/outputs/bundle/release/app-release.aab.
5. Wait for Play Console validation to finish.
6. Review all warnings and blockers before saving.
7. Paste the final release note text from docs/release/day29-release-note-v1.0.md.
8. Save the release draft.
9. Confirm or add the tester list.
10. Start rollout to Internal testing.

## 3. Immediate post-upload checks

- [ ] Verify the uploaded build appears with the expected version
- [ ] Copy the tester invite link
- [ ] Send the invite to the selected internal testers
- [ ] Record rollout timestamp for follow-up QA

## 4. Immediate post-rollout execution

- [ ] Install from the invite flow on at least 2 real devices
- [ ] Mark install/launch/first match in the QA matrix
- [ ] Verify one daily challenge flow
- [ ] Verify one survival flow
- [ ] Verify one share flow on supported device
- [ ] Check monitoring after first installs

## 5. Stop conditions

- Stop if Play Console reports signing mismatch
- Stop if policy/compliance warning blocks rollout
- Stop if install or first launch fails on the first two tester devices
