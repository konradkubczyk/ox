<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { joinGame } from '@/services/client'

enum JoinState {
  Joining,
  Joined,
  Error
}

interface JoinStatus {
  inProgress: boolean
  state: JoinState
  title: string
  message: string
}

let joinStatus = ref({
  inProgress: true,
  state: JoinState.Joining,
  title: 'Preparing',
  message: ''
} as JoinStatus)

const route = useRoute()

async function inviteLinkHandler() {
  joinStatus.value = {
    inProgress: true,
    state: JoinState.Joining,
    title: 'Joining',
    message: ''
  }

  const sessionId = route.params.sessionId as string
  console.log(sessionId)
  const inviteCode = route.query.inviteCode as string
  console.log(inviteCode)

  const game = await joinGame(sessionId, inviteCode)

  if (!game.ok) {
    joinStatus.value = {
      inProgress: false,
      state: JoinState.Error,
      title: 'Error',
      message: game.error
    }
    return
  }

  joinStatus.value = {
    inProgress: true,
    state: JoinState.Joined,
    title: 'Connecting',
    message: ''
  }

  router.push({
    name: 'game'
  })
}

inviteLinkHandler()

</script>

<template>
  <main>
    <div
      class="container w-96 h-96 rounded-xl mx-auto flex flex-col gap-5 justify-center items-center"
      :class="joinStatus.state === JoinState.Error ? 'bg-red-500 text-gray-900' : 'bg-primary-content'"
    >
      <span v-if="joinStatus.inProgress" class="loading loading-spinner loading-lg"></span>
      <h1 class="text-xl font-bold">{{ joinStatus.title }}</h1>
      <p v-if="joinStatus.message">{{ joinStatus.message }}</p>
    </div>
  </main>
</template>

<style scoped>

</style>
