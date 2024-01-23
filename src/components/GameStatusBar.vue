<script setup lang="ts">
defineProps({
  initialized: Boolean,
  player: String,
  turn: String
})

defineEmits(['quit'])
</script>

<template>
  <div class="bg-accent-content rounded-md p-3 flex gap-3 justify-between items-center text-neutral-content">
    <div
      v-if="!initialized"
      class="flex gap-3 items-center px-2"
    >
      <span class="loading loading-spinner loading-xs"></span>
      <p>Connecting...</p>
    </div>
    <div
      v-else-if="player !== turn"
      class="flex gap-3 items-center px-2"
    >
      <span class="loading loading-dots loading-xs"></span>
      <p>Waiting for opponent...</p>
    </div>
    <div
      v-else
      class="flex gap-3 items-center px-2"
    >
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span class="relative inline-flex rounded-full h-full w-full bg-accent"></span>
        </span>
      <p>Your turn</p>
    </div>
    <button
      class="btn btn-neutral btn-sm m-1"
      @click="$emit('quit')"
    >
      Quit
    </button>
  </div>
</template>
