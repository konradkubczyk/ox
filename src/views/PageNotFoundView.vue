<script setup lang="ts">
import router from '@/router'
</script>

<template>
  <section class="container w-96 h-96 rounded-xl mx-auto flex flex-col gap-5 justify-center items-center">
    <h2 class="text-3xl text-center">Page not found</h2>
    <p class="text-center">This resource does not exist.</p>
    <button
      class="btn btn-neutral"
      @click="router.push({ name: 'home' })"
    >
      Go to home page
    </button>
  </section>
</template>

<style scoped>

</style>
