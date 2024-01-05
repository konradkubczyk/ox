import { useSessionStore } from '@/stores/session'
import { account } from '@/lib/appwrite'

export async function loadSessionData() {
  console.log('[DEBUG] Fetching and updating session data')

  const sessionStore = useSessionStore()

  if (sessionStore.sessionID && sessionStore.userID) {
    console.log('Session data already loaded')
    return
  }

  try {
    const session = await account.getSession('current')
    sessionStore.setSessionID(session.$id)
    sessionStore.setUserID(session.userId)
    console.log('Fetched existing session')
    return
  } catch (error) {
    console.log('Error fetching existing session:', error)
  }

  try {
    const session = await account.createAnonymousSession()
    sessionStore.setSessionID(session.$id)
    sessionStore.setUserID(session.userId)
    console.log('Created new session')
    return
  } catch (error) {
    console.log('Error creating new session:', error)
  }
}

export async function clearSessionData() {
  console.log('[DEBUG] Clearing session data')
  const sessionStore = useSessionStore()

  sessionStore.setSessionID(null)
  sessionStore.setUserID(null)
  sessionStore.setCurrentGameID(null)

  try {
    await account.deleteSession('current')

    console.log('[DEBUG] Session data cleared')
  } catch (e) {
    console.error('Error while attempting to delete the current session:', e)
    throw e
  }
}
