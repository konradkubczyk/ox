import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const gameID = ref<string | null>(null)
  const invitationToken = ref<string | null>(null)
  const hostSymbol = ref<string | null>(null)
  const board = ref<string[] | null[]>([])

  function setGameID(id: string) {
    gameID.value = id
  }

  function setInvitationToken(token: string) {
    invitationToken.value = token
  }

  function setHostSymbol(symbol: string) {
    hostSymbol.value = symbol
  }

  function addMove(index: number) {
    console.log('[DEBUG] Adding move to index', index)
    if (board.value[index] !== null) {
      throw new Error('Position already taken')
    }
    board.value[index] = hostSymbol.value
  }

  function reset() {
    gameID.value = null
    invitationToken.value = null
    hostSymbol.value = null

    for (let i = 0; i < 9; i++) {
      board.value[i] = null
    }
  }

  return { gameID, invitationToken, hostSymbol, board, setGameID, setInvitationToken, setHostSymbol, addMove, reset }
})
