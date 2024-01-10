<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1
      class="text-4xl text-center py-4 text-clip bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-green-400 font-bold">
      OX
    </h1>
    <!--    <nav class="flex gap-4 justify-center p-4">-->
    <!--      <RouterLink to="/">Home</RouterLink>-->
    <!--      <RouterLink to="/game">Game</RouterLink>-->
    <!--    </nav>-->
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
