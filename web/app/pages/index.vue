<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="relative">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Claude Code Usage Leaderboard
        </h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          See how your Claude Code usage compares with your team
        </p>
      </div>
    </div>

    <!-- Setup Guide for logged-in users with no submissions -->
    <div
      v-if="user && data?.leaderboard && !data.leaderboard.find((e) => e.userId === user.id)"
      class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border-2 border-purple-200 overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Join the Leaderboard</h2>
            <p class="text-purple-100 text-sm">Set up automatic usage tracking in 2 minutes</p>
          </div>
        </div>
      </div>

      <!-- Steps -->
      <div class="p-8 space-y-6">
        <!-- Step 1: Get API Key -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              1
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1">Copy Your API Key</h3>
            <p class="text-gray-600 mb-3">
              Your unique key is waiting for you in
              <NuxtLink
                to="/settings"
                class="text-purple-600 hover:text-purple-700 font-semibold underline"
              >
                Settings
              </NuxtLink>
            </p>
            <NuxtLink to="/settings">
              <button
                class="px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Go to Settings →
              </button>
            </NuxtLink>
          </div>
        </div>

        <!-- Step 2: Configure CLI -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              2
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1">Configure the CLI</h3>
            <p class="text-gray-600 mb-3">Point the CLI to this server:</p>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              $ npx cc-leaderboard config --api-url {{ apiUrl }}
            </code>
          </div>
        </div>

        <!-- Step 3: Run Login Command -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              3
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1">Authenticate the CLI</h3>
            <p class="text-gray-600 mb-3">Run this command and paste your API key:</p>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              $ npx cc-leaderboard login
            </code>
          </div>
        </div>

        <!-- Step 4: Import Historical Data -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              4
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1">Import All Your Usage Data</h3>
            <p class="text-gray-600 mb-3">One command imports your entire Claude Code history:</p>
            <code class="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono">
              $ npx cc-leaderboard submit --all
            </code>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p class="text-sm text-blue-900">
                <strong class="font-semibold">✨ Pro tip:</strong> After the initial import, run
                <code class="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono"
                  >npx cc-leaderboard submit</code
                >
                daily to keep your stats updated!
              </p>
            </div>
          </div>
        </div>

        <!-- Help Link -->
        <div class="pt-4 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-600">
            Need help? Check out the
            <a
              href="https://github.com/jsell-rh/cc-leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              class="text-purple-600 hover:text-purple-700 font-semibold underline"
            >
              documentation on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap gap-3 justify-center">
        <Button
          v-for="p in periods"
          :key="p.value"
          :variant="period === p.value ? 'default' : 'outline'"
          @click="period = p.value"
          size="lg"
        >
          <svg
            v-if="p.icon"
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="p.icon" />
          </svg>
          {{ p.label }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="flex flex-col items-center justify-center py-12">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"
        ></div>
        <p class="mt-4 text-gray-600">Loading leaderboard...</p>
      </div>
    </div>

    <!-- Leaderboard -->
    <div v-else-if="data" class="space-y-4">
      <!-- Empty State -->
      <div
        v-if="data.leaderboard.length === 0"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center py-12"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No submissions yet</h3>
        <p class="text-gray-500">Be the first to submit your usage!</p>
      </div>

      <!-- Leaderboard Entries -->
      <div v-else class="space-y-3">
        <div
          v-for="(entry, index) in data.leaderboard"
          :key="entry.userId"
          :class="[
            'bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow',
            entry.userId === user?.id ? 'ring-2 ring-purple-500' : '',
            index < 3 ? 'shadow-md border-gray-300' : '',
          ]"
        >
          <!-- Rank Badge -->
          <div class="absolute top-0 left-0 w-20 h-20 -translate-x-8 -translate-y-8">
            <div
              :class="[
                'absolute inset-0 rounded-full',
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : '',
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : '',
                index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' : '',
                index > 2 ? 'bg-gradient-to-br from-purple-400 to-blue-500' : '',
              ]"
            ></div>
          </div>

          <div class="flex items-center justify-between gap-4 relative">
            <!-- Left Side: Rank + User -->
            <div class="flex items-center gap-4 flex-1">
              <!-- Medal/Rank -->
              <div class="flex-shrink-0 w-16 text-center">
                <div v-if="index < 3" class="text-4xl">
                  {{ ['🥇', '🥈', '🥉'][index] }}
                </div>
                <div v-else class="text-2xl font-bold text-gray-400">#{{ entry.rank }}</div>
              </div>

              <!-- Avatar + Name -->
              <div class="flex items-center gap-3 flex-1">
                <img
                  v-if="entry.avatar"
                  :src="entry.avatar"
                  :alt="entry.name"
                  :class="[
                    'h-12 w-12 rounded-full object-cover ring-2',
                    index < 3 ? 'ring-purple-500' : 'ring-gray-300',
                  ]"
                />
                <div>
                  <div class="font-semibold text-gray-900 flex items-center gap-2">
                    {{ entry.name }}
                    <span
                      v-if="entry.userId === user?.id"
                      class="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full"
                    >
                      You
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ entry.submissionCount }} submission{{
                      entry.submissionCount !== 1 ? 's' : ''
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Stats -->
            <div class="flex gap-6 items-center">
              <!-- Total Cost -->
              <div class="text-right">
                <div
                  :class="[
                    'text-2xl font-bold',
                    index === 0
                      ? 'text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text'
                      : '',
                    index === 1 ? 'text-gray-600' : '',
                    index === 2 ? 'text-amber-700' : '',
                    index > 2 ? 'text-purple-600' : '',
                  ]"
                >
                  ${{ entry.totalCost.toFixed(2) }}
                </div>
                <div class="text-xs text-gray-500">Total Cost</div>
              </div>

              <!-- Tokens -->
              <div class="hidden md:block text-right">
                <div class="text-sm font-medium text-gray-700">
                  {{ formatNumber(entry.totalInputTokens + entry.totalOutputTokens) }}
                </div>
                <div class="text-xs text-gray-500">Tokens</div>
              </div>
            </div>
          </div>

          <!-- Expandable Details (hidden for now, can add later) -->
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-lg shadow-sm border-2 border-red-200 p-6">
      <div class="flex items-center gap-3 text-red-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="font-semibold">Error loading leaderboard</h3>
          <p class="text-sm">{{ error.message }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Reference for users already on leaderboard -->
    <div
      v-if="user && data?.leaderboard && data.leaderboard.find((e) => e.userId === user.id)"
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Main Section -->
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">Keep Your Stats Updated</h3>
            <p class="text-gray-600 text-sm mb-3">
              Run this command daily to submit new usage data:
            </p>
            <code class="block bg-gray-900 text-green-400 px-4 py-2 rounded-lg text-sm font-mono">
              $ npx cc-leaderboard submit
            </code>
            <p class="text-xs text-gray-500 mt-2">
              View your API key in
              <NuxtLink to="/settings" class="text-purple-600 hover:text-purple-700 underline">
                Settings
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <!-- Advanced Tips Section -->
      <div class="bg-gradient-to-br from-purple-50 to-blue-50 border-t border-purple-100 p-6">
        <details class="group">
          <summary
            class="cursor-pointer list-none flex items-center justify-between font-semibold text-gray-900 hover:text-purple-700 transition-colors"
          >
            <span class="flex items-center gap-2">
              <svg
                class="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Advanced Options
            </span>
            <svg
              class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div class="mt-4 space-y-4 text-sm">
            <!-- Auto-Submit Section -->
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Automatic Daily Submissions
              </h4>
              <p class="text-gray-600 mb-3">Set up a cron job to submit automatically every day:</p>

              <div class="space-y-3">
                <div>
                  <p class="text-xs font-medium text-gray-700 mb-1">macOS/Linux:</p>
                  <code
                    class="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs font-mono"
                  >
                    # Edit crontab<br />
                    crontab -e<br /><br />
                    # Add this line (runs daily at 6 PM)<br />
                    0 18 * * * npx cc-leaderboard submit
                  </code>
                </div>

                <div>
                  <p class="text-xs font-medium text-gray-700 mb-1">Windows (Task Scheduler):</p>
                  <ol class="list-decimal list-inside text-gray-600 space-y-1 ml-2">
                    <li>Open Task Scheduler</li>
                    <li>Create a new task to run daily</li>
                    <li>
                      Set action to run:
                      <code class="bg-gray-100 px-1 rounded text-xs"
                        >npx cc-leaderboard submit</code
                      >
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <!-- Historical Import Section -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8V4"
                  />
                </svg>
                Import Historical Data
              </h4>
              <p class="text-gray-600 mb-2">Need to backfill or reimport your usage data?</p>
              <code class="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs font-mono">
                $ npx cc-leaderboard submit --all
              </code>
              <p class="text-xs text-gray-500 mt-2">
                This imports your entire Claude Code usage history, updating any existing entries.
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>

    <!-- CTA for non-logged in users -->
    <div
      v-else
      class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm p-8 text-center text-white"
    >
      <h3 class="text-2xl font-bold mb-2">Ready to get started?</h3>
      <p class="text-purple-100 mb-4">
        Sign in with GitHub to get your API key and start tracking your Claude Code usage
      </p>
      <a :href="githubAuthUrl">
        <Button variant="outline" class="bg-white text-purple-600 hover:bg-gray-100 border-0">
          Sign in with GitHub
        </Button>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import type { LeaderboardResponse } from '~/types/api'

const { user, loggedIn } = useUserSession()

// Build GitHub OAuth URL with basepath support
const { $config } = useNuxtApp()
const baseURL = $config.app.baseURL || '/'
const githubAuthUrl = `${baseURL}api/auth/github`.replace(/\/\//g, '/')

// Redirect to login if not authenticated
if (!loggedIn.value) {
  await navigateTo('/login')
}

const { data: configData } = await useFetch<{ apiUrl: string }>('/api/config')
const apiUrl = computed(() => configData.value?.apiUrl || 'http://localhost:3000')

const period = ref<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time')

const periods = [
  {
    label: 'Daily',
    value: 'daily' as const,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: 'Weekly',
    value: 'weekly' as const,
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Monthly',
    value: 'monthly' as const,
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    label: 'All Time',
    value: 'all-time' as const,
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
]

const { data, pending, error, refresh } = await useFetch<LeaderboardResponse>(
  () => `/api/leaderboard/${period.value}`,
  {
    watch: [period],
  }
)

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Check if coming from CLI login and redirect to settings
onMounted(() => {
  const cliLoginFlag = localStorage.getItem('cli-login')
  console.log('Index: Checking CLI login flag, value =', cliLoginFlag)

  if (cliLoginFlag === 'true') {
    console.log('Index: CLI flag detected! Redirecting to settings...')
    navigateTo('/settings')
  } else {
    console.log('Index: No CLI flag, staying on homepage')
  }

  const interval = setInterval(() => {
    refresh()
  }, 30000)

  onUnmounted(() => clearInterval(interval))
})
</script>
