# Day 24 - Versioning and Changelog Process

Datum: 2026-03-30
Statusz: Draft v1

## 1. Versioning policy

Current app values:

- package.json version: 0.1.0
- android/app/build.gradle versionCode: 1
- android/app/build.gradle versionName: 0.1.0

Policy:

- versionName follows semantic versioning: MAJOR.MINOR.PATCH
- versionCode must strictly increase on every Play upload

## 2. Release update procedure

1. Decide release scope (fix/feature/breaking).
2. Bump package.json version.
3. Update android/app/build.gradle:
   - versionCode = previous + 1
   - versionName = same as package.json version
4. Update CHANGELOG.md with a new section.
5. Build signed AAB and attach release note.

## 3. Changelog format

Create entries under Unreleased, then freeze on release tag.

Required sections:

- Added
- Changed
- Fixed

## 4. Release note source mapping

Play internal test note should be generated from:

- top 3 user-visible changes in CHANGELOG.md
- known limitations (if any)

## 5. Quality gate

- [ ] package.json and versionName aligned
- [ ] versionCode incremented
- [ ] CHANGELOG updated
- [ ] Internal test note drafted
