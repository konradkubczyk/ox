import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadSessionData, clearSessionData } from '@/services/session'

export const useSessionStore = defineStore('session', () => {
  const sessionID = ref<string | null>(null)
  const userID = ref<string | null>(null)
  const currentGameID = ref<string | null>(null)

  function setSessionID(id: string | null) {
    sessionID.value = id
  }

  function setUserID(id: string | null) {
    userID.value = id
  }

  function setCurrentGameID(id: string | null) {
    currentGameID.value = id
  }

  async function fetchSession() {
    await loadSessionData() // Call the service function here
  }

  async function clearSession() {
    await clearSessionData() // Call the service function to clear session data
  }

  return { sessionID, userID, currentGameID, setSessionID, setUserID, setCurrentGameID, fetchSession, clearSession }
});
