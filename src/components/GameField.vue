<script setup lang="ts">
import IconO from '@/components/icons/IconO.vue'
import IconX from '@/components/icons/IconX.vue'

defineProps({
  index: Number,
  player: String || null,
  waitingForOpponent: Boolean
})

defineEmits(['makeMove'])
</script>

<template>
  <button
    @click="$emit('makeMove', index)"
    class="btn h-full w-full text-8xl font-normal aspect-square p-5 sm:p-10"
    :disabled="waitingForOpponent || player != null"
  >
    <IconO v-if="player === '1'" class="fill-base-content" />
    <IconX v-else-if="player === '2'" class="fill-base-content" />
  </button>
</template>
