<script setup lang="ts">
import { createGame } from '@/services/client'
import { ref } from 'vue'
import GameCreationDialog from '@/components/GameCreationDialog.vue'
import { OperationStatesEnum } from '@/types/OperationStatesEnum'
import type { OperationStatusInterface } from '@/types/OperationStatusInterface'
import type { ToastInterface } from '@/types/ToastInterface'
import router from '@/router'

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
  <section class="text-center p-3">
    <div class="max-w-xl mx-auto">
      <h2 class="text-4xl md:text-5xl">
        Connect,
        <span class="text-clip bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-green-400">play</span>
        &&nbsp;win.
      </h2>
      <p class="my-8">
        Tic Tac Toe, Noughts and Crosses, or perhaps Xs and Os? However you call it, you can play it here. Challenge
        friends and unleash your inner strategic genius, or just enjoy some playful banter. It's all about connecting -
        both the dots and with your opponents!
      </p>
      <div class="flex gap-5 justify-center">
        <button
          @click="createGameHandler"
          class="btn btn-neutral"
        >
          Create a new game
        </button>
      </div>
    </div>
  </section>

  <GameCreationDialog :operation-status="operationStatus" :invite-link="inviteLink" @play="play" />
</template>
