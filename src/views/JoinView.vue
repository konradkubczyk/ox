<script setup lang="ts">
import { joinGame } from '@/services/game'
import { reactive } from 'vue'
import router from '@/router'

let status = reactive({
  error: false,
  message: 'Joining the game...'
})

async function joinGameHandler(gameID: string, invitationToken: string) {
  const result = await joinGame(invitationToken)
  console.log(result)
  if (!result.ok) {
    status.error = true
    status.message = result.message
    return
  }
  status.message = 'Joined successfully, redirecting...'
  setTimeout(() => {
    router.push(`/game/${gameID}`)
  }, 1000)
}

// Check if the user has query parameters in the URL, and if so, join the game
if (window.location.search) {
  const params = new URLSearchParams(window.location.search)
  const gameID = params.get('gameID')
  const invitationToken = params.get('invitationToken')
  if (gameID && invitationToken) {
    joinGameHandler(gameID, invitationToken)
  } else {
    status.error = true
    status.message = 'Invalid query parameters'
  }
}
</script>

<template>
  <h1 v-if="!status.error" class="text-2xl text-center text-gray-900">
    {{ status.message }}
  </h1>
  <h1 v-else class="text-2xl text-center text-red-500">
    {{ status.message }}
  </h1>
</template>

<style scoped>

</style>
