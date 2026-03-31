<template>
  <main class="screen privacy-screen">
    <section class="panel privacy-hero">
      <p class="section-label">RPSLS Tournament</p>
      <h1>
        {{
          uiStore.locale === "hu" ? "Adatvédelmi tájékoztató" : "Privacy Policy"
        }}
      </h1>
      <p class="privacy-meta">
        {{
          uiStore.locale === "hu"
            ? "Utolsó módosítás: 2026-03-31"
            : "Last updated: 2026-03-31"
        }}
      </p>
      <RouterLink class="secondary-button inline-button" to="/">
        {{ t("common.backHome") }}
      </RouterLink>
    </section>

    <template v-if="uiStore.locale === 'hu'">
      <section class="panel">
        <h2 class="privacy-section-title">1. Az adatkezelő</h2>
        <p>Juhász Tamás (egyéni fejlesztő)</p>
        <p>Székhely: Budapest, Magyarország</p>
        <p>
          Kapcsolat:
          <a href="mailto:tamasjuhasz84@yahoo.com">tamasjuhasz84@yahoo.com</a>
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">2. Milyen adatokat kezel az app</h2>
        <h3 class="privacy-subsection-title">Helyi tárolás (eszközön marad)</h3>
        <p>
          A torna állapota, beállítások (nyelv, hang, rezgés), statisztikák,
          napi kihívás és küldetések előrehaladása, lokális toplista. Ezeket az
          adatokat az app az eszközön tárolja; nem kerülnek szerverre.
        </p>
        <h3 class="privacy-subsection-title">Telemetria és hibajelentés</h3>
        <p>
          Az app anonim használati eseményeket (pl. meccs indítása, meccs vége,
          képernyő megjelenítése) és hibajelentési metaadatokat (hiba üzenet,
          platform) küld harmadik fél szolgáltatóknak a stabilitás és
          termékfejlesztés érdekében. A játékos beceneve
          <strong>nem</strong> kerül be ezekbe az eseményekbe.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">3. Harmadik felek</h2>
        <p>
          <strong>Firebase Analytics (Google)</strong> – használati és funnel
          adatok. Adatmegőrzés: max. 14 hónap.
        </p>
        <p><strong>Sentry</strong> – hibamonitoring. Adatmegőrzés: 90 nap.</p>
        <p>
          Az adatok Magyarországon kívülre kerülhetnek. Lásd:
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            >Google Adatvédelmi Irányelvek</a
          >,
          <a
            href="https://sentry.io/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            >Sentry Privacy Policy</a
          >.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">4. Jogalap</h2>
        <p>
          Helyi adattárolás: szerződés teljesítése (az app alapfunkciójához
          szükséges).
        </p>
        <p>
          Analitika és hibajelentés: jogos érdek (az app stabilitása és
          fejlesztése).
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">5. Érintetti jogok</h2>
        <p>
          Tájékoztatás, hozzáférés, helyesbítés, törlés, korlátozás, tiltakozás.
          A helyi app-adatok az app visszaállításával vagy eltávolításával
          törölhetők. Harmadik féltől tárolt adatokra vonatkozó kérelemhez lépj
          kapcsolatba az alábbi email-en.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">6. Gyermekek védelme</h2>
        <p>
          Az app nem célzottan gyerekeknek készül. 13 év alatti felhasználókra
          vonatkozó helyi szabályokat külön figyelembe kell venni.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">7. Kapcsolat</h2>
        <p>
          Adatvédelmi kérdésekkel:
          <a href="mailto:tamasjuhasz84@yahoo.com">tamasjuhasz84@yahoo.com</a>
        </p>
      </section>
    </template>

    <template v-else>
      <section class="panel">
        <h2 class="privacy-section-title">1. Data Controller</h2>
        <p>Tamás Juhász (individual developer)</p>
        <p>Location: Budapest, Hungary</p>
        <p>
          Contact:
          <a href="mailto:tamasjuhasz84@yahoo.com">tamasjuhasz84@yahoo.com</a>
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">2. Data We Process</h2>
        <h3 class="privacy-subsection-title">
          Local storage (stays on device)
        </h3>
        <p>
          Tournament state, settings (language, sound, haptics), stats, daily
          challenge and mission progress, local leaderboard. This data stays on
          your device and is not sent to any server.
        </p>
        <h3 class="privacy-subsection-title">Telemetry and error reporting</h3>
        <p>
          The app sends anonymous usage events (e.g. match start, match end,
          screen view) and error metadata (error message, platform) to
          third-party services to improve stability and product quality. The
          player nickname does <strong>not</strong> appear in these events.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">3. Third Parties</h2>
        <p>
          <strong>Firebase Analytics (Google)</strong> – usage and funnel data.
          Retention: up to 14 months.
        </p>
        <p><strong>Sentry</strong> – error monitoring. Retention: 90 days.</p>
        <p>
          Data may be transferred outside your country. See:
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            >Google Privacy Policy</a
          >,
          <a
            href="https://sentry.io/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            >Sentry Privacy Policy</a
          >.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">4. Legal Basis</h2>
        <p>
          Local data storage: contract performance (required for core app
          functionality).
        </p>
        <p>
          Analytics and error reporting: legitimate interest (app stability and
          improvement).
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">5. Your Rights</h2>
        <p>
          Access, rectification, erasure, restriction, objection. Local app data
          can be deleted by resetting or uninstalling the app. For requests
          regarding data held by third parties, contact us at the email below.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">6. Children</h2>
        <p>
          This app is not directed at children under 13. Applicable local rules
          regarding minors apply.
        </p>
      </section>

      <section class="panel">
        <h2 class="privacy-section-title">7. Contact</h2>
        <p>
          Privacy questions:
          <a href="mailto:tamasjuhasz84@yahoo.com">tamasjuhasz84@yahoo.com</a>
        </p>
      </section>
    </template>
  </main>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useUiStore } from "@/stores/ui";
import { trackScreen } from "@/services/analytics";

const { t } = useI18n();
const uiStore = useUiStore();

trackScreen("privacy");
</script>

<style scoped>
.privacy-screen {
  gap: var(--space-4, 1rem);
}

.privacy-hero h1 {
  margin-top: var(--space-2, 0.5rem);
}

.privacy-meta {
  font-size: 0.8rem;
  opacity: 0.6;
  margin-bottom: var(--space-3, 0.75rem);
}

.privacy-section-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: var(--space-2, 0.5rem);
}

.privacy-subsection-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: var(--space-3, 0.75rem);
  margin-bottom: var(--space-1, 0.25rem);
}

.panel p {
  margin-bottom: var(--space-2, 0.5rem);
  line-height: 1.6;
}

.panel p:last-child {
  margin-bottom: 0;
}

.panel a {
  color: inherit;
  text-decoration: underline;
}
</style>
