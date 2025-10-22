<script setup lang="ts">
import { AlertDialogCancel } from 'radix-vue'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <AlertDialogCancel
    :class="cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </AlertDialogCancel>
</template>
