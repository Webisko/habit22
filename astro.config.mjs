import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://habit22.eu',
  base: '/',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/zamowienie') &&
        !page.includes('/checkout') &&
        !page.includes('/podziekowanie') &&
        !page.includes('/thankyou') &&
        !page.includes('/konto') &&
        !page.includes('/account') &&
        !page.includes('/logowanie') &&
        !page.includes('/login') &&
        !page.includes('/ustaw-nowe-haslo') &&
        !page.includes('/set-new-password'),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: false, // Pl is served at / , En at /en/
    },
  },
});
