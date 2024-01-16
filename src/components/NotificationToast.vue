<script setup lang="ts">
import { type PropType } from 'vue'

interface Toast {
  type: 'error' | 'success' | 'warning' | 'info',
  text: string
}

defineProps({
  toast: {
    type: Object as PropType<Toast>,
    required: true
  }
})
</script>

<template>
  <div v-if="toast.text" class="toast">
    <div
      class="alert"
      :class="{
        'alert-error': toast.type === 'error',
        'alert-success': toast.type === 'success',
        'alert-warning': toast.type === 'warning',
        'alert-info': toast.type === 'info'
      }"
    >
      <span>{{ toast.text }}</span>
    </div>
  </div>
</template>
