<script setup lang="ts">
import router from '@/router'
import { createGame, joinGame } from '@/services/client'

async function createGameHandler() {
  try {
    const game = await createGame()
    alert(`Game session created.\nSession ID: ${game.sessionId}\nInvite code: ${game.inviteCode}`)
    await router.push({ name: 'game', params: { id: game.sessionId } })
  } catch (e) {
    alert('[ERROR] Failed to create a game session.\n' + e)
  }
}

async function joinGameHandler() {
  const sessionId = prompt('Enter session ID') || ''
  if (!sessionId) {
    alert('Session ID is required')
  }
  const inviteCode = prompt('Enter invite code') || ''
  if (!inviteCode) {
    alert('Invite code is required')
  }
  try {
    const game = await joinGame(sessionId, inviteCode)
    await router.push({ name: 'game', params: { id: game.sessionId } })
  } catch (e) {
    alert('[ERROR] Failed to join the game session.\n' + e)
  }
}
</script>

<template>
  <main class="text-center">
    <div class="max-w-xl mx-auto">
      <h1 class="text-5xl">
        Play
        <span class="text-clip bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-green-400">
        OX
      </span>
        now.
      </h1>
      <p class="my-10">
        Play with your friends online. Just create a new game and share the link or join an existing game. It's that
        easy.
      </p>
      <div class="flex gap-5 justify-center">
        <button
          @click="createGameHandler"
          class="py-3 px-4 rounded-lg text-2xl text-gray-900 bg-gray-100 hover:bg-gray-200 transition active:scale-95"
        >
          Create a new game
        </button>
        <button
          @click="joinGameHandler"
          class="py-3 px-4 rounded-lg text-2xl text-gray-100 bg-gray-900 hover:bg-gray-800 transition active:scale-95"
        >
          Join
        </button>
      </div>
    </div>
  </main>
</template>
