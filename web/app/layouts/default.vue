<template>
  <div
    class="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"
  >
    <!-- Professional Navigation -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div
              class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg group-hover:shadow-md transition-shadow"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900"> Claude Code Leaderboard </span>
          </NuxtLink>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <template v-if="loggedIn">
              <NuxtLink
                to="/settings"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Settings
              </NuxtLink>
              <div
                class="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
              >
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="h-8 w-8 rounded-full ring-2 ring-gray-200"
                />
                <span class="text-sm font-medium text-gray-900">{{ user?.name }}</span>
              </div>
              <Button
                variant="ghost"
                @click="handleLogout"
                class="hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </Button>
            </template>
            <template v-else>
              <Button @click="handleLogin"> Sign in with GitHub </Button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white/50 border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-gray-600">
          Track and compare Claude Code usage across your team
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { loggedIn, user, clear } = useUserSession()

const handleLogin = () => {
  // Use window.location for OAuth redirects to avoid client-side navigation issues
  window.location.href = '/api/auth/github'
}

const handleLogout = async () => {
  await clear()
  await navigateTo('/')
}
</script>
