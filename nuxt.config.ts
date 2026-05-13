import pkg from './package.json';

const isVercel = process.env.VERCEL === '1';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: [
    ...(!isVercel ? ['@nuxthub/core'] : []),
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxt/ui',
  ],
  hub: isVercel ? undefined : {
    database: true,
  },
  nitro: isVercel ? {
    preset: 'vercel',
  } : undefined,
  colorMode: {
    preference: 'dark',
  },
  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },
});
