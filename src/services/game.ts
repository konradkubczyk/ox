import { useSessionStore } from '@/stores/session'
import { databases, functions, ID } from '@/lib/appwrite'
import { useGameStore } from '@/stores/game'

function generateInvitationToken(length: number) {
  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let result = ''

  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
  }

  return result
}

export async function createGame() {
  console.log('[DEBUG] Creating a new game')

  const gameStore = useGameStore()

  // Ensure we have a session
  await useSessionStore().fetchSession()

  // Generate invitation token
  const invitationToken = generateInvitationToken(25)

  // Create a new game document
  try {
    const game = await databases.createDocument(
      '6596f2eb562ddd09d461',
      '6596f44fd2166b21d722',
      ID.unique(),
      {
        invitationToken
      }
    )

    gameStore.setGameID(game.$id)
    gameStore.setInvitationToken(invitationToken)

    return {
      id: game.$id,
      invitationToken
    }
  } catch (error) {
    console.error('An error occurred while trying to create a new game')
    throw error
  }
}

export async function joinGame(invitationToken: string) {
  console.log('[DEBUG] Joining a game')

  const gameStore = useGameStore()

  // Ensure we have a session
  await useSessionStore().fetchSession()

  try {
    const execution = await functions.createExecution(
      '6597428a807f348d4b53',
      JSON.stringify({ invitationToken }),
      false,
      '/',
      'POST',
      {
        'Content-Type': 'application/json'
      }
    )

    const response = JSON.parse(execution.responseBody)

    if (!response.ok) {
      return {
        ok: false,
        message: response.error
      }
    }

    return {
      ok: true,
      message: response.message,
      gameID: response.gameID,
      userID: response.userID,
      invitationToken: response.invitationToken
    }
  } catch (error) {
    console.error('An error occurred while trying to join the game')
    throw error
  }
}
