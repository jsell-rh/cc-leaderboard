<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Claude Code Usage Leaderboard',
  meta: [
    { name: 'description', content: 'Track and compare Claude Code usage across your team' }
  ]
})
</script>
