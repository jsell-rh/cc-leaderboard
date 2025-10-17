<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4"
      >
        <svg
          class="w-8 h-8 text-purple-600 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Redirecting to GitHub...</h2>
      <p class="text-gray-600">Please wait while we authenticate you</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $config } = useNuxtApp()

// Set localStorage flag to indicate CLI login
onMounted(() => {
  console.log('CLI Login: Setting localStorage flag')
  localStorage.setItem('cli-login', 'true')
  console.log('CLI Login: Flag set, value =', localStorage.getItem('cli-login'))

  // Build OAuth URL with basepath support
  const baseURL = $config.app.baseURL || '/'
  const oauthPath = `${baseURL}api/auth/github`.replace(/\/\//g, '/') // Remove double slashes

  // Small delay to ensure localStorage is saved
  setTimeout(() => {
    console.log('CLI Login: Redirecting to GitHub OAuth at', oauthPath)
    window.location.href = oauthPath
  }, 100)
})
</script>
