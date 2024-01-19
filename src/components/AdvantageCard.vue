<script setup lang="ts">
defineProps({
  title: String
})
</script>

<template>
  <div class="bg-base-200 p-4 rounded-lg">
    <h2 class="text-xl">{{ title }}</h2>
    <p class="mt-2 opacity-75">
      <slot />
    </p>
  </div>
</template>
