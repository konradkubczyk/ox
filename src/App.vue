<script setup lang="ts">
import { RouterView } from 'vue-router'

import IconO from '@/components/icons/IconO.vue'
import IconX from '@/components/icons/IconX.vue'
</script>

<template>
  <header class="text-center">
    <router-link to="/" class="opacity-50 hover:opacity-90 transition inline-block">
      <h1 class="text-4xl text-center py-4 select-none sr-only">OX</h1>
      <div class="flex gap-1 justify-center p-5">
        <IconO class="w-9 fill-base-content" />
        <IconX class="w-9 fill-base-content" />
      </div>
    </router-link>
  </header>

  <main>
    <RouterView />
  </main>

  <footer
    class="text-center p-4 flex mx-auto flex-wrap gap-x-6 sm:gap-x-10 gap-y-2 justify-center text-base-content/35 uppercase tracking-widest text-sm">
    <a href="https://konradkubczyk.com" target="_blank" class="hover:text-base-content/80 transition">
      Author
    </a>
    <RouterLink to="/licenses" class="hover:text-base-content/80 transition">
      Licenses
    </RouterLink>
    <a href="https://gitlab.com/konradkubczyk/ox" target="_blank" class="hover:text-base-content/80 transition">
      Code
    </a>
  </footer>
</template>

<style scoped></style>
