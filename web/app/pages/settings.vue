<template>
  <div class="max-w-4xl mx-auto space-y-6">
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
            <h3 class="font-semibold text-gray-900 mb-2">Login with the CLI</h3>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              npx cc-leaderboard login
            </code>
            <p class="text-xs text-gray-500 mt-2">
              This will open your browser to authenticate with GitHub
            </p>
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
            <h3 class="font-semibold text-gray-900 mb-2">Submit your usage</h3>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              npx cc-leaderboard submit
            </code>
            <p class="text-xs text-gray-500 mt-2">
              Automatically reads your Claude Code usage data from ccusage
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
      <Button as="a" href="/" variant="outline" size="lg" class="shadow-lg">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button/Button.vue'
import type { UserData } from '~/types/api'

definePageMeta({
  middleware: 'auth',
})

const { data: userData } = await useFetch<UserData>('/api/me')

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
