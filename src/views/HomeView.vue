<script setup lang="ts">
import { createGame, joinGame } from '@/services/game'

async function createGameHandler() {
  const game = await createGame()
  const currentURL = new URL(window.location.href)
  const invitationLink = `${currentURL.origin}/join?gameID=${game.id}&invitationToken=${game.invitationToken}`
  console.log(game)
  alert(invitationLink)
}

async function joinGameHandler() {
  const invitationLink = prompt('Enter invitation link')
  if (!invitationLink) {
    alert('No invitation link entered')
    return
  }
  window.location.href = invitationLink
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
          class="py-3 px-4 rounded-lg text-2xl text-gray-900 bg-gray-100 hover:bg-gray-200 transition"
        >
          Create a new game
        </button>
        <button
          @click="joinGameHandler"
          class="py-3 px-4 rounded-lg text-2xl text-gray-100 bg-gray-900 hover:bg-gray-800 transition"
        >
          Join
        </button>
      </div>
    </div>
  </main>
</template>
