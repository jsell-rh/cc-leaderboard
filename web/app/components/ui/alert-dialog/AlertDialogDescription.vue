<script setup lang="ts">
import { AlertDialogDescription } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <AlertDialogDescription :class="cn('text-sm text-gray-500', props.class)" v-bind="$attrs">
    <slot />
  </AlertDialogDescription>
</template>
