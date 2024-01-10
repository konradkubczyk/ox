<script setup lang="ts">
import { RouterView } from 'vue-router'

import IconO from '@/components/icons/IconO.vue'
import IconX from '@/components/icons/IconX.vue'
</script>

<template>
  <header>
    <h1 class="text-4xl text-center py-4 select-none sr-only">OX</h1>
    <div class="flex gap-1 justify-center p-5">
      <IconO class="w-9 w-9 fill-base-content/50" />
      <IconX class="w-9 w-9 fill-base-content/50" />
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="text-center p-4">
    <p class="text-base-content/35">
      Made by
      <a href="https://konradkubczyk.com">Konrad Kubczyk</a>
    </p>
  </footer>
</template>

<style scoped></style>
