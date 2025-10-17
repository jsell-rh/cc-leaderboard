<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Claude Code Usage Leaderboard</h1>
      <p class="text-gray-600">
        Track and compare Claude Code usage across your team. Submit your usage with the CLI tool.
      </p>
    </div>

    <!-- Period Selector -->
    <div class="flex space-x-2">
      <UButton
        v-for="p in periods"
        :key="p.value"
        :color="period === p.value ? 'primary' : 'gray'"
        :variant="period === p.value ? 'solid' : 'outline'"
        @click="period = p.value"
      >
        {{ p.label }}
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Leaderboard -->
    <div v-else-if="data" class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ periods.find(p => p.value === period)?.label }} Leaderboard
        </h2>
      </div>

      <div v-if="data.leaderboard.length === 0" class="p-12 text-center text-gray-500">
        No submissions yet. Be the first to submit!
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Cost
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Input Tokens
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Output Tokens
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submissions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="entry in data.leaderboard"
            :key="entry.userId"
            :class="entry.userId === user?.id ? 'bg-blue-50' : ''"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span
                  v-if="entry.rank <= 3"
                  class="text-2xl"
                >
                  {{ ['🥇', '🥈', '🥉'][entry.rank - 1] }}
                </span>
                <span
                  v-else
                  class="text-sm font-medium text-gray-900"
                >
                  #{{ entry.rank }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img
                  v-if="entry.avatar"
                  :src="entry.avatar"
                  :alt="entry.name"
                  class="h-10 w-10 rounded-full"
                />
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ entry.name }}
                    <span v-if="entry.userId === user?.id" class="text-blue-600">(You)</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="text-sm font-semibold text-gray-900">
                ${{ entry.totalCost.toFixed(2) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="text-sm text-gray-900">
                {{ formatNumber(entry.totalInputTokens) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="text-sm text-gray-900">
                {{ formatNumber(entry.totalOutputTokens) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="text-sm text-gray-500">
                {{ entry.submissionCount }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 class="text-red-800 font-semibold mb-2">Error loading leaderboard</h3>
      <p class="text-red-600 text-sm">{{ error.message }}</p>
    </div>

    <!-- CLI Instructions -->
    <div v-if="user" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-blue-900 font-semibold mb-3">Submit your usage</h3>
      <p class="text-blue-800 text-sm mb-3">
        Install the CLI tool and submit your usage data:
      </p>
      <code class="block bg-blue-100 px-4 py-2 rounded text-sm text-blue-900 font-mono">
        npx ccleaderboard login<br />
        npx ccleaderboard submit
      </code>
      <p class="text-blue-700 text-xs mt-3">
        Get your API key from <NuxtLink to="/settings" class="underline font-medium">Settings</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession()

const period = ref<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time')

const periods = [
  { label: 'Daily', value: 'daily' as const },
  { label: 'Weekly', value: 'weekly' as const },
  { label: 'Monthly', value: 'monthly' as const },
  { label: 'All Time', value: 'all-time' as const }
]

const { data, pending, error, refresh } = await useFetch(() => `/api/leaderboard/${period.value}`, {
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
