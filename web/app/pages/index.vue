<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="glass-card text-center">
      <div class="relative">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-glow">
            Claude Code Usage Leaderboard
          </span>
        </h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Track and compare Claude Code usage across your team. Submit your usage with the CLI tool.
        </p>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="glass-card">
      <div class="flex flex-wrap gap-3 justify-center">
        <Button
          v-for="p in periods"
          :key="p.value"
          :variant="period === p.value ? 'default' : 'outline'"
          @click="period = p.value"
          :class="period === p.value ? 'shadow-lg shadow-purple-500/30' : ''"
          size="lg"
        >
          <svg v-if="p.icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="p.icon" />
          </svg>
          {{ p.label }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="glass-card">
      <div class="flex flex-col items-center justify-center py-12">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-ping opacity-20"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-spin opacity-75"></div>
        </div>
        <p class="mt-4 text-gray-600">Loading leaderboard...</p>
      </div>
    </div>

    <!-- Leaderboard -->
    <div v-else-if="data" class="space-y-4">
      <!-- Empty State -->
      <div v-if="data.leaderboard.length === 0" class="glass-card text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            'glass-card glass-hover relative overflow-hidden transition-all duration-300',
            entry.userId === user?.id ? 'ring-2 ring-purple-500 ring-offset-2' : '',
            index < 3 ? 'shadow-xl' : ''
          ]"
          :style="index < 3 ? `transform: scale(${1 + (3 - index) * 0.02})` : ''"
        >
          <!-- Rank Badge -->
          <div class="absolute top-0 left-0 w-20 h-20 -translate-x-8 -translate-y-8">
            <div :class="[
              'absolute inset-0 rounded-full',
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : '',
              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : '',
              index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' : '',
              index > 2 ? 'bg-gradient-to-br from-purple-400 to-blue-500' : ''
            ]"></div>
          </div>

          <div class="flex items-center justify-between gap-4 relative">
            <!-- Left Side: Rank + User -->
            <div class="flex items-center gap-4 flex-1">
              <!-- Medal/Rank -->
              <div class="flex-shrink-0 w-16 text-center">
                <div v-if="index < 3" class="text-4xl animate-float" :style="`animation-delay: ${index * 0.2}s`">
                  {{ ['🥇', '🥈', '🥉'][index] }}
                </div>
                <div v-else class="text-2xl font-bold text-gray-400">
                  #{{ entry.rank }}
                </div>
              </div>

              <!-- Avatar + Name -->
              <div class="flex items-center gap-3 flex-1">
                <div class="relative">
                  <div v-if="index < 3" :class="[
                    'absolute inset-0 rounded-full blur-md',
                    index === 0 ? 'bg-yellow-400 animate-glow' : '',
                    index === 1 ? 'bg-gray-400 animate-glow' : '',
                    index === 2 ? 'bg-amber-600 animate-glow' : ''
                  ]"></div>
                  <img
                    v-if="entry.avatar"
                    :src="entry.avatar"
                    :alt="entry.name"
                    :class="[
                      'relative h-12 w-12 rounded-full object-cover',
                      index < 3 ? 'ring-4 ring-white shadow-lg' : 'ring-2 ring-purple-200'
                    ]"
                  />
                </div>
                <div>
                  <div class="font-semibold text-gray-900 flex items-center gap-2">
                    {{ entry.name }}
                    <span v-if="entry.userId === user?.id" class="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full">
                      You
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ entry.submissionCount }} submission{{ entry.submissionCount !== 1 ? 's' : '' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Stats -->
            <div class="flex gap-6 items-center">
              <!-- Total Cost -->
              <div class="text-right">
                <div :class="[
                  'text-2xl font-bold',
                  index === 0 ? 'text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text' : '',
                  index === 1 ? 'text-gray-600' : '',
                  index === 2 ? 'text-amber-700' : '',
                  index > 2 ? 'text-purple-600' : ''
                ]">
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
    <div v-else-if="error" class="glass-card border-2 border-red-200">
      <div class="flex items-center gap-3 text-red-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-semibold">Error loading leaderboard</h3>
          <p class="text-sm">{{ error.message }}</p>
        </div>
      </div>
    </div>

    <!-- CLI Instructions -->
    <div v-if="user" class="glass-card border-2 border-purple-200">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Submit your usage</h3>
          <p class="text-gray-600 text-sm mb-3">
            Install the CLI tool and submit your usage data:
          </p>
          <code class="block glass px-4 py-3 rounded-lg text-sm font-mono text-purple-700 mb-3 border border-purple-200">
            npx ccleaderboard login<br />
            npx ccleaderboard submit
          </code>
          <p class="text-xs text-gray-500">
            Get your API key from
            <NuxtLink to="/settings" class="text-purple-600 hover:text-purple-700 font-medium underline">
              Settings
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import type { LeaderboardResponse } from '~/types/api'

const { user } = useUserSession()

const period = ref<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time')

const periods = [
  {
    label: 'Daily',
    value: 'daily' as const,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    label: 'Weekly',
    value: 'weekly' as const,
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    label: 'Monthly',
    value: 'monthly' as const,
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    label: 'All Time',
    value: 'all-time' as const,
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  }
]

const { data, pending, error, refresh } = await useFetch<LeaderboardResponse>(() => `/api/leaderboard/${period.value}`, {
  watch: [period]
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Auto-refresh every 30 seconds
onMounted(() => {
  const interval = setInterval(() => {
    refresh()
  }, 30000)

  onUnmounted(() => clearInterval(interval))
})
</script>
