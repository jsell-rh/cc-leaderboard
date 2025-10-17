<template>
  <div class="max-w-3xl">
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div class="p-6 space-y-6">
        <!-- User Info -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div v-if="userData" class="flex items-center space-x-4">
            <img
              v-if="userData.avatar"
              :src="userData.avatar"
              :alt="userData.name"
              class="h-16 w-16 rounded-full"
            />
            <div>
              <div class="text-sm font-medium text-gray-900">{{ userData.name }}</div>
              <div class="text-sm text-gray-500">{{ userData.email }}</div>
              <div class="text-xs text-gray-400 mt-1">
                Member since {{ new Date(userData.createdAt).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- API Key -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">API Key</h2>
          <p class="text-sm text-gray-600 mb-3">
            Use this API key with the CLI tool to submit your usage data.
          </p>

          <div class="flex items-center space-x-2">
            <input
              :value="showKey ? userData?.apiKey : '••••••••••••••••••••••••••••'"
              readonly
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
            />
            <UButton
              color="gray"
              variant="outline"
              @click="showKey = !showKey"
            >
              {{ showKey ? 'Hide' : 'Show' }}
            </UButton>
            <UButton
              color="primary"
              @click="copyApiKey"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </UButton>
          </div>
        </div>

        <!-- CLI Instructions -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">1. Login with the CLI</h3>
              <code class="block bg-gray-100 px-4 py-2 rounded text-sm font-mono">
                npx ccleaderboard login
              </code>
              <p class="text-xs text-gray-500 mt-1">
                This will open your browser to authenticate
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">2. Submit your usage</h3>
              <code class="block bg-gray-100 px-4 py-2 rounded text-sm font-mono">
                npx ccleaderboard submit
              </code>
              <p class="text-xs text-gray-500 mt-1">
                Automatically reads your Claude Code usage data
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">3. (Optional) Enable auto-submit</h3>
              <code class="block bg-gray-100 px-4 py-2 rounded text-sm font-mono">
                npx ccleaderboard config --auto-submit daily
              </code>
              <p class="text-xs text-gray-500 mt-1">
                Automatically submit your usage once per day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { data: userData } = await useFetch('/api/me')

const showKey = ref(false)
const copied = ref(false)

const copyApiKey = async () => {
  if (userData.value?.apiKey) {
    await navigator.clipboard.writeText(userData.value.apiKey)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>
