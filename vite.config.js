import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      manifestFilename: "manifest.json",
      includeAssets: [
        "icons/apple-touch-icon.svg",
        "icons/favicon.svg",
        "icons/*.png",
        "screenshots/*.png",
      ],
      manifest: {
        name: "RPSLS Tournament",
        short_name: "RPSLS",
        description:
          "Mobile-first Rock, Paper, Scissors, Lizard, Spock tournament game built with Vue 3.",
        id: "/",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone"],
        start_url: "/",
        scope: "/",
        lang: "hu",
        protocol_handlers: [
          {
            protocol: "web+rpsls",
            url: "/?action=%s",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/rpsls-desktop-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "RPSLS Tournament desktop gameplay view",
          },
          {
            src: "/screenshots/rpsls-mobile.png",
            sizes: "540x960",
            type: "image/png",
            label: "RPSLS Tournament mobile gameplay view",
          },
        ],
        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,webp,json}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.smoke.test.js"],
    setupFiles: ["./src/test/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: [
        "src/stores/**/*.js",
        "src/utils/**/*.js",
        "src/services/**/*.js",
      ],
      exclude: [
        "src/test/**",
        "src/**/*.smoke.test.js",
        "src/**/__tests__/**",
        "src/services/analytics/providers/*.js",
        "src/services/monitoring/index.js",
      ],
      thresholds: {
        lines: 65,
        statements: 60,
        functions: 55,
        branches: 50,
      },
    },
    plugins: [
      {
        name: "svg-mock",
        transform(_code, id) {
          if (id.endsWith(".svg")) {
            return { code: "export default ''" };
          }
        },
      },
    ],
  },
});
