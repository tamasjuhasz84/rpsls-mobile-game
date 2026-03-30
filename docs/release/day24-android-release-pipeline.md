# Day 24 - Android Release Build Pipeline (Signed AAB)

Datum: 2026-03-30
Statusz: Draft v1
Platform: Android / Google Play

## 1. Goal

Reproducible release workflow signed AAB artifacttal, amely alkalmas internal test track feltoltesre.

## 2. Implemented project hooks

Updated files:

- android/app/build.gradle
- package.json

Added npm scripts:

- npm run android:sync
- npm run android:release:check
- npm run android:aab:release

## 3. Signing environment variables

A release signing env valtozokra epul:

- RPSLS_UPLOAD_STORE_FILE
- RPSLS_UPLOAD_STORE_PASSWORD
- RPSLS_UPLOAD_KEY_ALIAS
- RPSLS_UPLOAD_KEY_PASSWORD

PowerShell pelda (lokalis session):

```powershell
$env:RPSLS_UPLOAD_STORE_FILE="C:\keystores\rpsls-upload.jks"
$env:RPSLS_UPLOAD_STORE_PASSWORD="<store_password>"
$env:RPSLS_UPLOAD_KEY_ALIAS="upload"
$env:RPSLS_UPLOAD_KEY_PASSWORD="<key_password>"
```

## 4. Release command sequence

1. Web build + Android sync:

```bash
npm run android:sync
```

2. Signing env sanity hint:

```bash
npm run android:release:check
```

3. Signed AAB build:

```bash
npm run android:aab:release
```

## 5. Expected output

Default AAB output path:

- android/app/build/outputs/bundle/release/app-release.aab

## 6. Validation checklist

- [ ] Env varok beallitva ugyanabban a shell sessionben
- [ ] npm run android:sync lefut hiba nelkul
- [ ] npm run android:aab:release lefut hiba nelkul
- [ ] AAB fajl legeneralodott
- [ ] Build timestamp + version informacio rogzitve

## 7. Notes

- Ha signing env nincs beallitva, a release build unsigned lesz.
- Signed artifact nelkul Play Console internal track feltoltes nem veglegesitheto.
