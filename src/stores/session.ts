import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const sessionId = ref<string | null>(null)
  const gameId = ref<string | null>(null)
  const playerKey = ref<string | null>(null)
  const inviteCode = ref<string | null>(null)
  const player = ref<string | null>(null)

  if (localStorage.getItem('session')) {
    const session = JSON.parse(localStorage.getItem('session') || '{}')
    sessionId.value = session.sessionId
    gameId.value = session.gameId
    playerKey.value = session.playerKey
    inviteCode.value = session.inviteCode
    player.value = session.player
  }

  function setSessionId(id: string) {
    sessionId.value = id
  }

  function setGameId(id: string) {
    gameId.value = id
  }

  function setPlayerKey(key: string) {
    playerKey.value = key
  }

  function setInviteCode(code: string) {
    inviteCode.value = code
  }

  function setPlayer(slot: string) {
    player.value = slot
  }

  function clear() {
    sessionId.value = null
    gameId.value = null
    playerKey.value = null
    inviteCode.value = null
  }

  return {
    sessionId,
    gameId,
    playerKey,
    inviteCode,
    player,
    setSessionId,
    setGameId,
    setPlayerKey,
    setInviteCode,
    setPlayer,
    clear
  }
})
