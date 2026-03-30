# Technikai Spike - Analytics Provider valasztas

Datum: 2026-03-30
Statusz: Day 1 javaslat, veglegesites felhasznaloi dontessel

## Opcio osszehasonlitas (MVP mobil jatekhoz)

### Firebase Analytics (+ Crashlytics + Remote Config)

- Pro:
  - Android/Play Store kozeli, gyors setup
  - Free tier barati
  - Jo alap retention funnelre (D1/D7, events)
  - Crashlytics integracio egyszeru
- Kontra:
  - Nyers event export/SQL elemzes korlatosabb GA4 UI-ban
  - Privacy/compliance beallitasokra figyelni kell

### Amplitude

- Pro:
  - Ersebb product analytics, funnel/cohort UX
  - Jobb retention elemzes dobozbol
- Kontra:
  - Kultebb setup, esetleges koltseg korabban jelentkezik
  - Crash monitoring kulon tool kell

### PostHog (cloud/self-host)

- Pro:
  - Rugalmas, feature flag + analytics egyben
  - Self-host opcio
- Kontra:
  - Tobb ops/konfiguracio overhead
  - Android hibrid appnal extra validacio kell

## Donto kriteriumok (sulyozott)

- Setup gyorsasag (30%)
- Koltseg MVP fazisban (25%)
- Mobil stabilitas + crash integracio (25%)
- Retention elemzes melysege (20%)

## Day 1 ajanlas

- Elso koros valasztas: Firebase stack (Analytics + Crashlytics)
- Indok: legkisebb kivitelezesi riziko, leggyorsabb time-to-value a roadmap Het 1 celjaihoz.
- B terv: ha 2-3 heten belul melyebb cohort/funnel kell, Amplitude parhuzamos pilot csak analytics retegben.

## Rogzitett target-strategia (dontes)

- Web build: Firebase Analytics + Sentry
- Android wrapper build: Firebase Analytics + Crashlytics

Megjegyzes:

- Az analytics event taxonomia kozos marad mindket targeten.
- Hibariport oldalon target-fuggo backend fut (web = Sentry, Android = Crashlytics).

## Technikai implementacios javaslat

- Keszuljon egy analytics adapter reteg, hogy provider-csere olcso legyen:
  - src/services/analytics/index.js
  - src/services/analytics/providers/firebase.js
  - src/services/analytics/providers/console.js
- Event API pelda:
  - trackScreen(screenName, params)
  - trackEvent(eventName, params)
  - setUserProperties(props)

## Day 1 decision gate

A tovabblepeshez egyetlen dontes kell:

1. Maradjon a Firebase mint primary provider a Nap 2 integraciohoz?
