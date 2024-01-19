<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import { createGame } from '@/services/client'
import { OperationStatesEnum } from '@/types/OperationStatesEnum'
import type { OperationStatusInterface } from '@/types/OperationStatusInterface'
import type { ToastInterface } from '@/types/ToastInterface'
import GameCreationDialog from '@/components/GameCreationDialog.vue'
import AdvantageCard from '@/components/AdvantageCard.vue'

const inviteLink = ref('')

const toast = ref({ type: 'info', text: '' } as ToastInterface)

const operationStatus = ref({
  inProgress: false,
  state: OperationStatesEnum.Idle,
  title: '',
  message: ''
} as OperationStatusInterface)

async function createGameHandler() {
  operationStatus.value = {
    inProgress: true,
    state: OperationStatesEnum.Creating,
    title: 'Creating a new game session',
    message: 'Please wait...'
  }

  try {
    const game = await createGame()

    inviteLink.value = window.location.protocol + '//' + window.location.host + `/join/${game.sessionId}?inviteCode=${game.inviteCode}`

    operationStatus.value = {
      inProgress: false,
      state: OperationStatesEnum.Created,
      title: 'Game session created',
      message: 'Your game session has been created. Share the link with your friends.'
    }
  } catch (error) {
    operationStatus.value = {
      inProgress: false,
      state: OperationStatesEnum.Error,
      title: 'Failed to create a game session',
      message: 'Something went wrong. Please try again later.'
    }
    toast.value.text = 'Failed to create a game session'
    console.error(error)
  }
}

async function play() {
  await router.push({ name: 'game' })
}
</script>

<template>
  <section class="text-center px-4">
    <div class="max-w-xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-semibold">
        Connect &
        <span class="text-clip bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-green-400">play</span>
      </h2>
      <p class="my-4 opacity-75">
        Tic Tac Toe, Noughts and Crosses, or perhaps Xs and Os? However you call it, you can play it here. Challenge
        friends and unleash your inner strategic genius, or just enjoy some playful banter. It's all about connecting -
        both the dots and with your opponents!
      </p>
      <div class="flex gap-5 justify-center">
        <button
          @click="createGameHandler"
          class="btn btn-neutral w-full sm:w-auto"
        >
          Create a new game
        </button>
      </div>
    </div>
  </section>
  <section class="text-center px-4 mt-4 sm:mt-8">
    <div class="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
      <AdvantageCard title="Open source">
        The game is open source, and you can find its code in the <a href="https://gitlab.com/konradkubczyk/ox"
                                                                     target="_blank" class="link">repository</a>.
      </AdvantageCard>
      <AdvantageCard title="Privacy-friendly">
        No accounts, no invasive tracking and no ads. Just a simple game.
      </AdvantageCard>
    </div>
  </section>

  <GameCreationDialog :operation-status="operationStatus" :invite-link="inviteLink" @play="play" />
</template>
