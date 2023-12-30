<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="flex gap-4 justify-center p-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/game">Game</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="text-center p-4">
    <p>
      Made with
      <span class="text-red-500">&hearts;</span>
      by
      <a href="https://konradkubczyk.com">Konrad Kubczyk</a>
    </p>
  </footer>
</template>

<style scoped></style>
