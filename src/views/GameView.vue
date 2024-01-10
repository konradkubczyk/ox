<script setup lang="ts">

import { useSessionStore } from '@/stores/session'
import { connectToGame, loadGame, makeMove } from '@/services/client'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'
import router from '@/router'

const NUMBER_OF_FIELDS = 9

const sessionStore = useSessionStore()
const gameStore = useGameStore()

let positions = computed(() => Array.from(gameStore.positions.values()))

if (sessionStore.gameId) {
  loadGame(sessionStore.gameId)
  connectToGame(sessionStore.gameId)
}

function makeMoveHandler(fieldNumber: number) {
  makeMove(fieldNumber)
}

function quit() {
  useSessionStore().clear()
  useGameStore().clear()
  router.push({ name: 'home' })
}
</script>

<template>
  <section class="container mx-auto flex gap-4 w-2/3 text-gray-700">
    <div class="flex-1 grid grid-cols-3 border rounded-xl text-center gap-4 p-4 max-w-3xl mx-auto">
      <button
        v-for="fieldNumber in NUMBER_OF_FIELDS"
        :key="fieldNumber - 1"
        @click="makeMoveHandler(fieldNumber - 1)"
        class="aspect-square rounded-lg flex justify-center items-center bg-gray-100 hover:bg-gray-200 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer transition text-8xl"
        :disabled="sessionStore.player !== gameStore.turn"
      >
        {{ positions[fieldNumber - 1].player || '' }}
      </button>
    </div>
  </section>
  <section class="p-5 text-center">
    <button @click="quit">Quit</button>
  </section>
</template>

<style scoped>

</style>
