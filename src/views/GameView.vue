<script setup lang="ts">
const numberOfFields = 9;

function fieldClicked(fieldNumber: number) {
  console.log(`[DEBUG] Field ${fieldNumber} clicked.`);
}
</script>

<template>
  <section class="container w-1/3 mx-auto">
    <div class="grid grid-cols-3 border rounded-xl text-center gap-4 p-4">
      <div
          v-for="fieldNumber in numberOfFields"
          :key="fieldNumber"
          @click="fieldClicked(fieldNumber)"
          class="aspect-square rounded-lg flex justify-center items-center bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
      >
        {{ fieldNumber }}
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
