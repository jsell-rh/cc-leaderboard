<template>
  <div
    class="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"
  >
    <!-- Professional Navigation -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink :to="loggedIn ? '/' : '/login'" class="flex items-center space-x-3 group">
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
              <a href="/api/auth/github">
                <Button> Sign in with GitHub </Button>
              </a>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white/50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col items-center gap-2">
          <p class="text-center text-sm text-gray-600">
            Track and compare Claude Code usage across your team
          </p>
          <a
            href="https://github.com/jsell-rh/cc-leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { loggedIn, user, clear } = useUserSession()

const handleLogout = async () => {
  await clear()
  await navigateTo('/')
}
</script>
