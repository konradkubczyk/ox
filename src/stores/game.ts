import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const gameID = ref<string | null>(null)
  const invitationToken = ref<string | null>(null)

  function setGameID(id: string) {
    gameID.value = id
  }

  function setInvitationToken(token: string) {
    invitationToken.value = token
  }

  return { gameID, invitationToken, setGameID, setInvitationToken }
})
