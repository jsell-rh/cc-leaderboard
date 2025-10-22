<script setup lang="ts">
import { AlertDialogPortal } from 'radix-vue'
</script>

<template>
  <AlertDialogPortal v-bind="$attrs">
    <slot />
  </AlertDialogPortal>
</template>
