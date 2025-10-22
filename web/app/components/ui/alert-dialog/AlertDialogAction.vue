<script setup lang="ts">
import { AlertDialogAction } from 'radix-vue'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <AlertDialogAction :class="cn(buttonVariants(), props.class)" v-bind="$attrs">
    <slot />
  </AlertDialogAction>
</template>
