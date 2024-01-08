<script setup lang="ts">
import router from '@/router'
import { leaveGame, makeMove } from '@/services/game'
import { computed, reactive, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const NUMBER_OF_FIELDS = 9

function fieldClicked(position: number) {
  console.log(`[DEBUG] Field ${position} clicked (col: ${(position - 1) % 3 + 1}, row: ${Math.floor((position - 1) / 3) + 1})`)
  makeMove(position)
}

async function quit() {
  try {
    await leaveGame()
  } catch (e) {
    console.error(e)
  }
  await router.push('/')
}

const gameStore = useGameStore()

const board = computed(() => Array.from(gameStore.board.values()))

</script>

<template>
  <section class="container mx-auto flex gap-4 w-2/3 text-gray-700">
    <div class="flex-1 grid grid-cols-3 border rounded-xl text-center gap-4 p-4 max-w-3xl mx-auto">
      <div
        v-for="fieldNumber in NUMBER_OF_FIELDS"
        :key="fieldNumber"
        @click="fieldClicked(fieldNumber - 1)"
        class="aspect-square rounded-lg flex justify-center items-center bg-gray-100 hover:bg-gray-200 cursor-pointer transition text-8xl"
      >
        {{ board[fieldNumber - 1] }}
      </div>
    </div>
  </section>
  <section class="p-5 text-center">
    <button @click="quit">Quit</button>
  </section>
</template>

<style scoped>

</style>
