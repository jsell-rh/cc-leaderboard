// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  srcDir: 'app/',

  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-auth-utils'],

  css: ['~/assets/css/main.css'],

  // App configuration for basepath support
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },

  // shadcn config - components are manually imported, no auto-scanning needed
  shadcn: {
    prefix: '',
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

    // Session configuration - this is where h3 session reads config from
    session: {
      password:
        process.env.NUXT_SESSION_PASSWORD ||
        process.env.NUXT_JWT_SECRET ||
        'change-me-in-production-min-32-chars-long',
      cookie: {
        // Use the basepath for cookie path to ensure cookies work with subpath deployment
        path: process.env.NUXT_APP_BASE_URL || '/',
        sameSite: 'lax' as const,
      },
    },

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
    typeCheck: false, // Disable during dev - Nuxt auto-imports aren't recognized by vue-tsc
  },
})
