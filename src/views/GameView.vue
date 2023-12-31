<script setup lang="ts">
const numberOfFields = 9;

function fieldClicked(fieldNumber: number) {
  console.log(`[DEBUG] Field ${fieldNumber} clicked (col: ${(fieldNumber - 1) % 3 + 1}, row: ${Math.floor((fieldNumber - 1) / 3) + 1})`);
}
</script>

<template>
  <section class="container mx-auto flex gap-4 w-2/3 text-gray-700">
    <div class="border rounded-xl p-4 w-1/5">
      <h2 class="uppercase tracking-wider font-semibold text-center">
        History
      </h2>
      <table class="w-full">
        <thead class="text-left">
        <tr>
          <th>#</th>
          <th>Winner</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>1</td>
          <td>X</td>
        </tr>
        <tr>
          <td>2</td>
          <td>O</td>
        </tr>
        <tr>
          <td>3</td>
          <td>X</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="flex-1 grid grid-cols-3 border rounded-xl text-center gap-4 p-4">
      <div
          v-for="fieldNumber in numberOfFields"
          :key="fieldNumber"
          @click="fieldClicked(fieldNumber)"
          class="aspect-square rounded-lg flex justify-center items-center bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
      >
        {{ fieldNumber }}
      </div>
    </div>
    <div class="border rounded-xl p-4 w-1/5">
      <h2 class="uppercase tracking-wider font-semibold text-center">
        Moves
      </h2>
      <table class="w-full">
        <thead class="text-left">
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Col</th>
          <th>Row</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>1</td>
          <td>X</td>
          <td>3</td>
          <td>2</td>
        </tr>
        <tr>
          <td>2</td>
          <td>O</td>
          <td>2</td>
          <td>1</td>
        </tr>
        <tr>
          <td>3</td>
          <td>X</td>
          <td>1</td>
          <td>3</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>

</style>
