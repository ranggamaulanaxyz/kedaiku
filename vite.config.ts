import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    VitePWA({
      registerType: "autoUpdate",
      // Mendaftarkan semua aset statis penting agar bisa diakses offline
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "robots.txt"],
      manifest: {
        name: "KEDAIKU",
        short_name: "KEDAIKU",
        description: "Aplikasi Management Warung",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        background_color: "oklch(0.99 0 0)",
        theme_color: "oklch(0.922 0 0)",
        icons: [
          {
            src: "icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any", // Optimasi untuk launcher Android
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any", // Optimasi untuk launcher Android
          },
        ],
        screenshots: [
          {
            src: "screenshots/screenshot-wide.png",
            sizes: "1920x945",
            type: "image/png",
            form_factor: "wide",
            label: "KEDAIKU Desktop",
          },
          {
            src: "screenshots/screenshot-narrow.png",
            sizes: "500x717",
            type: "image/png",
            form_factor: "narrow",
            label: "KEDAIKU Mobile",
          },
        ],
      },
      devOptions: {
        enabled: true, // Mengaktifkan service worker saat local development (localhost)
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
