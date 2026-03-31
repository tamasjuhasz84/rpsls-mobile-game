<template>
  <main class="screen terms-screen">
    <section class="panel terms-hero">
      <p class="section-label">RPSLS Tournament</p>
      <h1>
        {{
          uiStore.locale === "hu" ? "Felhasználási feltételek" : "Terms of Use"
        }}
      </h1>
      <p class="terms-meta">
        {{
          uiStore.locale === "hu"
            ? "Hatályos: 2026-03-31"
            : "Effective: 2026-03-31"
        }}
      </p>
      <RouterLink class="secondary-button inline-button" to="/">
        {{ t("common.backHome") }}
      </RouterLink>
    </section>

    <template v-if="uiStore.locale === 'hu'">
      <section class="panel">
        <h2 class="terms-section-title">1. A szolgáltatásról</h2>
        <p>
          Az RPSLS Tournament egy account nélkül használható, egyjátékos,
          kő-papír-olló-gyík-spock torna app. Az app helyi játékállapoton és
          anonim telemetrián alapul, és nem garantál folyamatos rendelkezésre
          állást, hibamentes működést vagy specifikus eredményt.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">2. Elfogadható használat</h2>
        <p>
          Az app jogszerű és nem visszaélésszerű használatára kötelezed magad.
        </p>
        <p>
          Tilos az app működésének megzavarása, visszafejtése, automatizált
          támadása vagy technikai korlátainak megkerülése.
        </p>
        <p>
          Tilos más személy nevének, identitásának vagy jogainak sértése a
          becenév megadásakor.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">3. Szellemi tulajdon</h2>
        <p>
          Az app forráskódja, UI elemei, saját grafikák, szövegek és játéklogika
          a fejlesztő tulajdona; engedély nélkül nem másolhatók, nem
          terjeszthetők.
        </p>
        <p>
          A harmadik felek könyvtárai és szolgáltatásai saját licencük szerint
          használhatók.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">4. Harmadik felek</h2>
        <p>
          Az app Firebase Analytics és Sentry szolgáltatásokat vesz igénybe.
          Ezek saját adatkezelési feltételeik szerint működnek; a részleteket az
          adatvédelmi tájékoztató tartalmazza.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">5. Garanciakizárás</h2>
        <p>
          Az app "ahogy van" alapon érhető el, bármilyen kifejezett vagy
          hallgatólagos garancia nélkül. A játékon belüli státuszok,
          statisztikák és mentési adatok technikai hiba, törlés vagy eltávolítás
          következtében elveszhetnek.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">6. Felelősségkorlátozás</h2>
        <p>
          A megengedett jogi keretek között a fejlesztő nem felel közvetett,
          esetleges vagy következményes károkért, beleértve az adatveszteséget.
          A fogyasztóvédelmi jogszabályok által garantált jogok nem érintettek.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">7. Feltételek változása</h2>
        <p>
          A feltételek időről időre frissülhetnek; a hatályba lépés dátuma felül
          frissül. Lényeges változásnál értesítés érkezhet az appon belül.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">8. Irányadó jog</h2>
        <p>
          Irányadó jog: Magyar jog. Jogvita esetén a magyar általános hatáskörű
          bíróság illetékes.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">9. Kapcsolat</h2>
        <p>Fejlesztő: Juhász Tamás</p>
        <p>
          Email:
          <a href="mailto:tamasjuhasz84@yahoo.com">tamasjuhasz84@yahoo.com</a>
        </p>
        <p>
          Adatvédelmi tájékoztató:
          <a href="/privacy">rpsls-mobile-game.vercel.app/privacy</a>
        </p>
      </section>
    </template>

    <template v-else>
      <section class="panel">
        <h2 class="terms-section-title">1. About the Service</h2>
        <p>
          RPSLS Tournament is a single-player, account-free
          Rock-Paper-Scissors-Lizard-Spock tournament app. It is based on local
          game state and anonymous telemetry, and offers no guarantee of
          continuous availability, error-free operation, or specific results.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">2. Acceptable Use</h2>
        <p>You agree to use the app lawfully and not abusively.</p>
        <p>
          Disrupting, reverse-engineering, attacking, or circumventing the app's
          technical limits is prohibited.
        </p>
        <p>
          Using the nickname field to impersonate or infringe on another
          person's identity or rights is prohibited.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">3. Intellectual Property</h2>
        <p>
          The app's source code, UI elements, original graphics, text, and game
          logic are the developer's property and may not be copied or
          distributed without permission.
        </p>
        <p>
          Third-party libraries and services are subject to their own licenses.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">4. Third-Party Services</h2>
        <p>
          The app uses Firebase Analytics and Sentry. These operate under their
          own terms. See the Privacy Policy for details.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">5. Disclaimer of Warranties</h2>
        <p>
          The app is provided "as is" without any express or implied warranty.
          In-app status, stats, and saved data may be lost due to technical
          failure, reset, or uninstall.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">6. Limitation of Liability</h2>
        <p>
          To the extent permitted by law, the developer is not liable for
          indirect, incidental, or consequential damages including data loss.
          Statutory consumer rights are not affected.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">7. Changes to Terms</h2>
        <p>
          These terms may be updated periodically; the effective date at the top
          will reflect any changes. A notice may appear in-app for significant
          updates.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">8. Governing Law</h2>
        <p>
          These terms are governed by the laws of Hungary. Disputes are subject
          to the jurisdiction of Hungarian courts.
        </p>
      </section>

      <section class="panel">
        <h2 class="terms-section-title">9. Contact</h2>
        <p>Developer: Tamás Juhász</p>
        <p>
          Email:
          <a href="mailto:tamasjuhasz84@yahoo.com">tamasjuhasz84@yahoo.com</a>
        </p>
        <p>
          Privacy Policy:
          <a href="/privacy">rpsls-mobile-game.vercel.app/privacy</a>
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

trackScreen("terms");
</script>

<style scoped>
.terms-screen {
  gap: var(--space-4, 1rem);
}

.terms-hero h1 {
  margin-top: var(--space-2, 0.5rem);
}

.terms-meta {
  font-size: 0.8rem;
  opacity: 0.6;
  margin-bottom: var(--space-3, 0.75rem);
}

.terms-section-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: var(--space-2, 0.5rem);
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
