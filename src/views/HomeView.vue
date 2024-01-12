<script setup lang="ts">
import router from '@/router'
import { createGame } from '@/services/client'
import { onMounted, ref, watch } from 'vue'

enum OperationState {
  Idle,
  Creating,
  Created,
  Joining,
  Joined,
  Error
}

interface OperationStatus {
  inProgress: boolean
  state: OperationState
  title: string
  message: string
}

let operationStatus = ref({
  inProgress: false,
  state: OperationState.Idle,
  title: '',
  message: ''
} as OperationStatus)

const modal = ref<HTMLDialogElement | null>(null)
onMounted(() => {
  watch(operationStatus, (status) => {
    if (status.state !== OperationState.Idle && modal.value) {
      modal.value.showModal()
    }
  })
})

const inviteLinkField = ref<HTMLInputElement | null>(null)
const inviteLink = ref('')
const toastText = ref('')
const copiedInviteLink = ref(false)

function selectAndCopyText() {
  if (!inviteLinkField.value) {
    return
  }
  inviteLinkField.value.select()
  const link = inviteLinkField.value.value
  navigator.clipboard.writeText(link).then(() => {
    copiedInviteLink.value = true
    toastText.value = 'Copied to clipboard'
    setTimeout(() => {
      toastText.value = ''
    }, 3000)
  })
}

async function createGameHandler() {

  operationStatus.value = {
    inProgress: true,
    state: OperationState.Creating,
    title: 'Creating a new game session',
    message: 'Please wait...'
  }

  try {
    const game = await createGame()

    inviteLink.value = window.location.protocol + '//' + window.location.host + `/join/${game.sessionId}?inviteCode=${game.inviteCode}`

    operationStatus.value = {
      inProgress: false,
      state: OperationState.Created,
      title: 'Game session created',
      message: 'Your game session has been created. Share the link with your friends.'
    }
  } catch (error) {
    operationStatus.value = {
      inProgress: false,
      state: OperationState.Error,
      title: 'Failed to create a game session',
      message: 'Something went wrong. Please try again later.'
    }
    toastText.value = 'Failed to create a game session'
    console.error(error)
  }
}
</script>

<template>
  <section class="text-center p-3">
    <div class="max-w-xl mx-auto">
      <h2 class="text-5xl">
        Connect,
        <span class="text-clip bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-green-400">play</span>,
        win.
      </h2>
      <p class="my-10">
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

  <dialog ref="modal" class="modal">
    <div class="modal-box flex gap-4 flex-col">
      <div class="flex gap-3">
        <span v-if="operationStatus.inProgress" class="loading loading-spinner loading-md"></span>
        <h3 class="font-bold text-lg">{{ operationStatus.title }}</h3>
      </div>
      <p>{{ operationStatus.message }}</p>
      <input
        ref="inviteLinkField"
        class="input input-bordered join-item w-full"
        :value="inviteLink"
        v-if="operationStatus.state === OperationState.Created"
        @click="selectAndCopyText"
        readonly
      />
      <button
        v-if="operationStatus.state === OperationState.Created"
        class="btn"
        :disabled="!copiedInviteLink"
        @click="() => router.push({ name: 'game' })"
      >
        {{ copiedInviteLink ? 'Play now' : 'Copy the link to continue' }}
      </button>
      <div
        v-if="operationStatus.state === OperationState.Error"
        class="modal-action mt-0"
      >
        <form method="dialog" class="w-full">
          <button class="btn w-full">Close</button>
        </form>
      </div>
    </div>

    <div v-if="toastText" class="toast">
      <div class="alert alert-info">
        <span>{{ toastText }}</span>
      </div>
    </div>
  </dialog>
</template>
