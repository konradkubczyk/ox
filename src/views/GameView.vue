<script setup lang="ts">
import { useSessionStore } from '@/stores/session'
import { connectToGame, loadGame, makeMove } from '@/services/client'
import { useGameStore } from '@/stores/game'
import { computed, ref, watch } from 'vue'
import router from '@/router'
import NotificationToast from '@/components/NotificationToast.vue'
import type { PreviousStatsInterface } from '@/types/PreviousStatsInterface'
import type { ToastInterface } from '@/types/ToastInterface'
import GameField from '@/components/GameField.vue'
import type { FieldInterface } from '@/types/FieldInterface'
import GameStatusBar from '@/components/GameStatusBar.vue'

const NUMBER_OF_FIELDS = 9

const sessionStore = useSessionStore()
const gameStore = useGameStore()

const toast = ref({ type: 'info', text: '' } as ToastInterface)

const previousStats = ref<PreviousStatsInterface>({
  player1Wins: 0,
  player2Wins: 0,
  gameNumber: 0
})

let hydrated = false

watch(() => gameStore.gameNumber, (gameNumber) => {
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

let positions = computed(() => Array.from(gameStore.positions.values()) as FieldInterface[])
const initialized = ref(false)

async function initializeGame() {
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
  <section class="flex flex-col gap-3 max-w-3xl mx-auto px-3">
    <GameStatusBar
      :initialized="initialized"
      :player="sessionStore.player as (string | undefined)"
      :turn="gameStore.turn as (string | undefined)"
      @quit="quit"
    />
    <div
      class="aspect-square grid grid-cols-3 gap-3"
    >
      <GameField
        v-for="(field, index) in NUMBER_OF_FIELDS"
        :key="field"
        :index="index"
        :player="positions[index].player as (string | undefined)"
        :waitingForOpponent="sessionStore.player !== gameStore.turn"
        @make-move="makeMoveHandler"
      />
    </div>
    <div>
      <p class="opacity-50 text-center">
        Round {{ gameStore.gameNumber || '-' }} ({{ gameStore.player1Wins === null ? '-' : gameStore.player1Wins }} :
        {{ gameStore.player2Wins === null ? '-' : gameStore.player2Wins }})
      </p>
    </div>
  </section>

  <NotificationToast :toast="toast" />
</template>
