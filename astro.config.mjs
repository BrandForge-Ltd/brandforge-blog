// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    sanity({
      projectId: 'aejxymic',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2024-01-01',
      studioBasePath: '/studio',
    }),
  ],

  adapter: cloudflare()
});