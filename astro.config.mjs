import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://habit22.com',
  base: '/habit22/',
  integrations: [react(), sitemap()],
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
