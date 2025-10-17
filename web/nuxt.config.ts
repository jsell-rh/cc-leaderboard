// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-auth-utils'],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  runtimeConfig: {
    // Private keys (server-side only)
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
    },
    jwtSecret: process.env.NUXT_JWT_SECRET || 'change-me-in-production',

    // Public keys (exposed to client)
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      requiredEmailDomain: process.env.NUXT_PUBLIC_REQUIRED_EMAIL_DOMAIN || '@redhat.com',
    },
  },

  nitro: {
    experimental: {
      database: true,
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
})
