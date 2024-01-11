<script setup lang="ts">

import { useSessionStore } from '@/stores/session'
import { connectToGame, loadGame, makeMove } from '@/services/client'
import { useGameStore } from '@/stores/game'
import { computed, ref, watch } from 'vue'
import router from '@/router'

import IconX from '@/components/icons/IconX.vue'
import IconO from '@/components/icons/IconO.vue'

interface Toast {
  type: 'error' | 'success' | 'warning' | 'info',
  text: string
}

const toast = ref<Toast>({ type: 'info', text: '' })

const NUMBER_OF_FIELDS = 9

const sessionStore = useSessionStore()
const gameStore = useGameStore()

interface PreviousStats {
  player1Wins: number
  player2Wins: number
  gameNumber: number
}

const previousStats = ref<PreviousStats>({
  player1Wins: 0,
  player2Wins: 0,
  gameNumber: 0
})
let hydrated = false
watch(() => gameStore.gameNumber, (gameNumber) => {
  console.log(gameNumber, previousStats.value.gameNumber)
  if (gameNumber === null || !hydrated) {
    hydrated = true
    return
  }
  if (gameNumber > previousStats.value.gameNumber && gameNumber > 1 && gameStore.player1Wins !== null && gameStore.player2Wins !== null) {
    if (gameStore.player1Wins > previousStats.value.player1Wins) {
      if (sessionStore.player === '1') {
        toast.value = { type: 'success', text: 'You won!' }
      } else {
        toast.value = { type: 'warning', text: 'Opponent won!' }
      }
    } else if (gameStore.player2Wins > previousStats.value.player2Wins) {
      if (sessionStore.player === '2') {
        toast.value = { type: 'success', text: 'You won!' }
      } else {
        toast.value = { type: 'warning', text: 'Opponent won!' }
      }
    } else {
      toast.value = { type: 'info', text: 'Draw!' }
    }
    setTimeout(() => {
      toast.value.text = ''
    }, 3000)
  }
  previousStats.value = {
    player1Wins: gameStore.player1Wins || 0,
    player2Wins: gameStore.player2Wins || 0,
    gameNumber: gameNumber
  }
})

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

let changingField = ref(-1)

async function makeMoveHandler(fieldNumber: number) {
  changingField.value = fieldNumber
  try {
    const move = await makeMove(fieldNumber)
    if (!move.ok) {
      toast.value = { type: 'error', text: move.error }
      setTimeout(() => {
        toast.value.text = ''
      }, 3000)
    }
  } catch (error) {
    console.error(error)
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
  <main class="flex flex-col gap-3 max-w-3xl mx-auto px-3">
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
        :key="field"
        @click="makeMoveHandler(index)"
        class="btn h-full w-full text-8xl font-normal aspect-square p-5 sm:p-10"
        :disabled="sessionStore.player !== gameStore.turn || Boolean(positions[index].player) || changingField !== -1"
      >
        <IconO v-if="positions[index].player == 1" class="fill-base-content" />
        <IconX v-else-if="positions[index].player == 2" class="fill-base-content" />
      </button>
    </section>
    <section>
      <p class="opacity-50 text-center">
        Round {{ gameStore.gameNumber || '-' }} ({{ gameStore.player1Wins === null ? '-' : gameStore.player1Wins }} :
        {{ gameStore.player2Wins === null ? '-' : gameStore.player2Wins }})
      </p>
    </section>
  </main>

  <div v-if="toast.text" class="toast">
    <div
      class="alert"
      :class="{
        'alert-error': toast.type === 'error',
        'alert-success': toast.type === 'success',
        'alert-warning': toast.type === 'warning',
        'alert-info': toast.type === 'info'
      }"
    >
      <span>{{ toast.text }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
