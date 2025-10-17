<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <span class="text-2xl font-bold text-gray-900">Claude Code Leaderboard</span>
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="user">
              <NuxtLink
                to="/settings"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Settings
              </NuxtLink>
              <div class="flex items-center space-x-2">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="h-8 w-8 rounded-full"
                />
                <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
              </div>
              <UButton
                color="gray"
                variant="ghost"
                @click="handleLogout"
              >
                Logout
              </UButton>
            </template>
            <template v-else>
              <UButton
                color="primary"
                @click="handleLogin"
              >
                Sign in with GitHub
              </UButton>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-gray-500">
          Track and compare Claude Code usage across your team
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession()

const handleLogin = async () => {
  await navigateTo('/api/auth/github')
}

const handleLogout = async () => {
  await clear()
  await navigateTo('/')
}
</script>
