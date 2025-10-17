<template>
  <div class="min-h-screen relative overflow-x-hidden">
    <!-- Animated background gradient -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100"></div>
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
      ></div>
      <div
        class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
        style="animation-delay: 4s"
      ></div>
    </div>

    <!-- Glassmorphic Navigation -->
    <nav class="sticky top-0 z-50 glass border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-md group-hover:blur-lg transition-all"
              ></div>
              <div
                class="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-xl"
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
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Claude Code Leaderboard
            </span>
          </NuxtLink>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <template v-if="loggedIn">
              <NuxtLink
                to="/settings"
                class="glass-hover px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-purple-600 transition-all"
              >
                Settings
              </NuxtLink>
              <div class="flex items-center space-x-3 glass px-4 py-2 rounded-xl">
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="h-8 w-8 rounded-full ring-2 ring-purple-500/50"
                />
                <span class="text-sm font-medium text-gray-700">{{ user?.name }}</span>
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
              <Button @click="handleLogin" class="shadow-lg shadow-purple-500/30">
                Sign in with GitHub
              </Button>
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
    <footer class="glass border-t border-white/20 mt-auto">
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

const handleLogin = async () => {
  await navigateTo('/api/auth/github')
}

const handleLogout = async () => {
  await clear()
  await navigateTo('/')
}
</script>
