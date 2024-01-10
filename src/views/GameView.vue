<script setup lang="ts">

import { useSessionStore } from '@/stores/session'
import { connectToGame, loadGame, makeMove } from '@/services/client'
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'
import router from '@/router'

import IconX from '@/components/icons/IconX.vue'
import IconO from '@/components/icons/IconO.vue'

const NUMBER_OF_FIELDS = 9

const sessionStore = useSessionStore()
const gameStore = useGameStore()

let positions = computed(() => Array.from(gameStore.positions.values()))
const initialized = ref(false)

async function initializeGame() {
  if (!sessionStore.gameId) {
    quit()
  }
  await loadGame(sessionStore.gameId as string)
  await connectToGame(sessionStore.gameId as string)

  initialized.value = true
}

initializeGame()

const toastText = ref('')
let changingField = ref(-1)

async function makeMoveHandler(fieldNumber: number) {
  changingField.value = fieldNumber
  const move = await makeMove(fieldNumber)
  if (!move.ok) {
    toastText.value = move.error
    setTimeout(() => {
      toastText.value = ''
    }, 3000)
  }
  changingField.value = -1
}

function quit() {
  useSessionStore().clear()
  useGameStore().clear()
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="flex flex-col gap-3 max-w-3xl mx-auto p-3">
    <section class="bg-accent-content rounded-md p-3 flex gap-3 justify-between items-center text-neutral-content">
      <div
        v-if="!initialized"
        class="flex gap-3 items-center px-2"
      >
        <span class="loading loading-spinner loading-xs"></span>
        <p>Connecting...</p>
      </div>
      <div
        v-else-if="sessionStore.player !== gameStore.turn"
        class="flex gap-3 items-center px-2"
      >
        <span class="loading loading-dots loading-xs"></span>
        <p>Waiting for opponent...</p>
      </div>
      <div
        v-else
        class="flex gap-3 items-center px-2"
      >
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span class="relative inline-flex rounded-full h-full w-full bg-accent"></span>
        </span>
        <p>Your turn</p>
      </div>
      <button
        class="btn btn-neutral btn-sm m-1"
        @click="quit"
      >
        Quit
      </button>
    </section>
    <section
      class="aspect-square grid grid-cols-3 gap-3"
    >
      <button
        v-for="(field, index) in NUMBER_OF_FIELDS"
        :key="index"
        @click="makeMoveHandler(index)"
        class="btn h-full w-full text-8xl font-normal aspect-square p-5 sm:p-10"
        :disabled="sessionStore.player !== gameStore.turn || Boolean(positions[index].player) || changingField !== -1"
      >
        <span v-if="changingField === index" class="loading loading-ring loading-lg"></span>
        <IconO v-else-if="positions[index].player == 1" />
        <IconX v-else-if="positions[index].player == 2" />
      </button>
    </section>
    <section>
      <p class="opacity-50 text-center">
        Round {{ gameStore.gameNumber || '-' }} ({{ gameStore.player1Wins === null ? '-' : gameStore.player1Wins }} :
        {{ gameStore.player2Wins === null ? '-' : gameStore.player2Wins }})
      </p>
    </section>
  </main>

  <div v-if="toastText" class="toast">
    <div class="alert alert-error">
      <span>{{ toastText }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
