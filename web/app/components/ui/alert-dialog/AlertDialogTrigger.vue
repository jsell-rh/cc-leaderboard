<script setup lang="ts">
import { AlertDialogTrigger } from 'radix-vue'

defineProps<{
  asChild?: boolean
}>()
</script>

<template>
  <AlertDialogTrigger v-bind="$attrs">
    <slot />
  </AlertDialogTrigger>
</template>
