<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- CLI Welcome Banner -->
    <div
      v-if="showCliWelcome"
      class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg border border-purple-300 p-6 text-white"
    >
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-2">Welcome! You're almost done</h3>
          <p class="text-purple-100 mb-3">
            Your GitHub authentication was successful. Now copy your API key below and paste it into
            your terminal to complete the setup.
          </p>
          <div class="flex items-center gap-2 text-sm text-purple-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Click the "Show" button below, then click "Copy" to copy your API key</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
          <p class="text-gray-600">Manage your account and API access</p>
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Profile
      </h2>

      <div v-if="userData" class="flex items-center gap-6">
        <img
          v-if="userData.avatar"
          :src="userData.avatar"
          :alt="userData.name"
          class="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
        />
        <div class="flex-1">
          <div class="text-xl font-semibold text-gray-900">{{ userData.name }}</div>
          <div class="text-sm text-gray-600 flex items-center gap-2 mt-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {{ userData.email }}
          </div>
          <div class="text-xs text-gray-500 mt-2">
            Member since
            {{
              new Date(userData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- API Key Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-start gap-3 mb-4">
        <div
          class="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-900">API Key</h2>
          <p class="text-sm text-gray-600 mt-1">
            Use this API key with the CLI tool to submit your usage data securely.
          </p>
        </div>
      </div>

      <div class="space-y-3">
        <div class="relative">
          <input
            :value="showKey ? userData?.apiKey : '••••••••••••••••••••••••••••••••••••••••••••'"
            readonly
            class="w-full px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <div class="flex gap-2">
          <Button variant="outline" @click="showKey = !showKey" class="flex-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!showKey"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                v-if="!showKey"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            {{ showKey ? 'Hide' : 'Show' }}
          </Button>

          <Button
            @click="copyApiKey"
            :class="copied ? 'bg-green-600 hover:bg-green-700' : ''"
            class="flex-1 shadow-lg shadow-purple-500/30"
          >
            <svg
              v-if="!copied"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {{ copied ? 'Copied!' : 'Copy' }}
          </Button>

          <Button
            variant="destructive"
            @click="regenerateApiKey"
            :disabled="regenerating"
            class="flex-1"
          >
            <svg
              v-if="!regenerating"
              class="w-4 h-4"
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
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ regenerating ? 'Regenerating...' : 'Regenerate' }}
          </Button>
        </div>

        <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex gap-2 text-sm text-yellow-800">
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              <strong>Warning:</strong> Regenerating your API key will invalidate the old key.
              You'll need to update the CLI with the new key using
              <code class="bg-yellow-100 px-1 py-0.5 rounded">npx cc-leaderboard login</code>.
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- CLI Instructions -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Getting Started</h2>
      </div>

      <div class="space-y-6">
        <!-- Step 1 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
            >
              1
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">Configure the API URL</h3>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              npx cc-leaderboard config --api-url {{ apiUrl }}
            </code>
            <p class="text-xs text-gray-500 mt-2">Point the CLI to this leaderboard server</p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
            >
              2
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">Login with the CLI</h3>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              npx cc-leaderboard login
            </code>
            <p class="text-xs text-gray-500 mt-2">
              This will open your browser to authenticate with GitHub
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
            >
              3
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">Submit your usage</h3>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              npx cc-leaderboard submit
            </code>
            <p class="text-xs text-gray-500 mt-2">
              Automatically reads your Claude Code usage data from ccusage
            </p>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
            >
              4
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">
              <span class="text-gray-500 text-sm">(Optional)</span> Enable auto-submit
            </h3>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              npx cc-leaderboard config --auto-submit daily
            </code>
            <p class="text-xs text-gray-500 mt-2">
              Set up a cron job to automatically submit your usage once per day
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Leaderboard -->
    <div class="flex justify-center pt-4">
      <NuxtLink to="/">
        <Button variant="outline" size="lg" class="shadow-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Leaderboard
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import type { UserData } from '~/types/api'

definePageMeta({
  middleware: 'auth',
})

const { data: userData } = await useFetch<UserData>('/api/me')
const { data: config } = await useFetch<{ apiUrl: string }>('/api/config')

const showKey = ref(false)
const copied = ref(false)
const showCliWelcome = ref(false)
const regenerating = ref(false)

const apiUrl = computed(() => config.value?.apiUrl || 'http://localhost:3000')

// Check localStorage for CLI login flag
onMounted(() => {
  const cliLoginFlag = localStorage.getItem('cli-login')
  console.log('Settings: Checking CLI login flag, value =', cliLoginFlag)

  if (cliLoginFlag === 'true') {
    console.log('Settings: CLI flag detected! Showing welcome banner')
    showCliWelcome.value = true
    // Clear the flag so it doesn't show again
    localStorage.removeItem('cli-login')
    console.log('Settings: Flag cleared')
  } else {
    console.log('Settings: No CLI flag, hiding banner')
  }
})

const copyApiKey = async () => {
  if (userData.value?.apiKey) {
    await navigator.clipboard.writeText(userData.value.apiKey)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

const regenerateApiKey = async () => {
  if (
    !confirm(
      "Are you sure you want to regenerate your API key? This will invalidate your current key and you'll need to update the CLI."
    )
  ) {
    return
  }

  regenerating.value = true

  try {
    const { data } = await $fetch<{ apiKey: string }>('/api/regenerate-key', {
      method: 'POST',
    })

    if (data.value && userData.value) {
      // Update the local user data with the new API key
      userData.value.apiKey = data.value.apiKey
      showKey.value = true

      // Show success message
      alert('API key regenerated successfully! Make sure to copy your new key.')
    }
  } catch (error) {
    console.error('Error regenerating API key:', error)
    alert('Failed to regenerate API key. Please try again.')
  } finally {
    regenerating.value = false
  }
}
</script>
