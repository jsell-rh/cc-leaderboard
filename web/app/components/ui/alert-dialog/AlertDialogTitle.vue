<script setup lang="ts">
import { AlertDialogTitle } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <AlertDialogTitle :class="cn('text-lg font-semibold', props.class)" v-bind="$attrs">
    <slot />
  </AlertDialogTitle>
</template>
