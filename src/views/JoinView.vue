<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { joinGame } from '@/services/client'
import { useSessionStore } from '@/stores/session'
import { useGameStore } from '@/stores/game'
import { JoinState } from '@/types/JoinStatesEnum'
import type { JoinStatusInterface } from '@/types/JoinStatusInterface'

let joinStatus = ref({
  inProgress: true,
  state: JoinState.Joining,
  title: 'Preparing',
  message: ''
} as JoinStatusInterface)

const route = useRoute()

async function inviteLinkHandler() {
  joinStatus.value = {
    inProgress: true,
    state: JoinState.Joining,
    title: 'Joining',
    message: ''
  }

  const sessionId = route.params.sessionId as string
  const inviteCode = route.query.inviteCode as string

  try {
    await joinGame(sessionId, inviteCode)
  } catch (error) {
    console.error(error)
    joinStatus.value = {
      inProgress: false,
      state: JoinState.Error,
      title: 'Error',
      message: 'Something went wrong. Please try again later.'
    }
    return
  }

  joinStatus.value = {
    inProgress: true,
    state: JoinState.Joined,
    title: 'Connecting',
    message: ''
  }

  await router.push({
    name: 'game'
  })
}

inviteLinkHandler()

function quit() {
  useSessionStore().clear()
  useGameStore().clear()
  router.push({ name: 'home' })
}
</script>

<template>
  <div
    class="container w-96 h-96 rounded-xl mx-auto flex flex-col gap-5 justify-center items-center"
    :class="joinStatus.state === JoinState.Error ? 'bg-rose-950' : 'bg-primary-content'"
  >
    <span v-if="joinStatus.inProgress" class="loading loading-spinner loading-lg"></span>
    <h1 class="text-xl font-bold">{{ joinStatus.title }}</h1>
    <p v-if="joinStatus.message">{{ joinStatus.message }}</p>
    <button
      v-if="joinStatus.state === JoinState.Error"
      class="btn"
      @click="quit"
    >
      Quit
    </button>
  </div>
</template>

<style scoped>

</style>
