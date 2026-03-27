import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      manifestFilename: "manifest.json",
      includeAssets: ["icons/apple-touch-icon.svg", "icons/favicon.svg"],
      manifest: {
        name: "RPSLS Tournament",
        short_name: "RPSLS",
        description:
          "Mobile-first Rock, Paper, Scissors, Lizard, Spock tournament game built with Vue 3.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "hu",
        icons: [
          {
            src: "/icons/pwa-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/pwa-maskable.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
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
});
