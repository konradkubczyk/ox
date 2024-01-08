import { useSessionStore } from '@/stores/session'
import { client, databases, functions, ID } from '@/lib/appwrite'
import { useGameStore } from '@/stores/game'
import router from '@/router'

function generateInvitationToken(length: number) {
  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let result = ''

  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
  }

  return result
}

function subscribeToGame(gameID: string) {
  // client.subscribe(`databases.6596f2eb562ddd09d461.collections.6596f44fd2166b21d722.documents.${gameID}`, response => {
  client.subscribe(`databases.6596f2eb562ddd09d461.collections.*`, response => {
    console.log('[DEBUG] Received a message from the server')
    console.log(response)
    const gameStore = useGameStore()
    gameStore.board = response.payload.moves.map((move: any) => move.player)
    console.log(Array.from(gameStore.board.values()))
  })
}

export async function createGame(preferredSymbol?: string) {
  console.log('[DEBUG] Creating a new game')

  const gameStore = useGameStore()
  gameStore.reset()

  // Ensure we have a session
  await useSessionStore().fetchSession()

  // Generate invitation token
  const invitationToken = generateInvitationToken(25)

  // Const host symbol
  const hostSymbol = preferredSymbol || (Math.random() > 0.5 ? 'X' : 'O')

  // Create a new game document
  try {
    const game = await databases.createDocument(
      '6596f2eb562ddd09d461',
      '6596f44fd2166b21d722',
      ID.unique(),
      {
        invitationToken,
        hostSymbol
      }
    )

    gameStore.setGameID(game.$id)
    gameStore.setInvitationToken(invitationToken)
    gameStore.setHostSymbol(hostSymbol)

    console.log('[DEBUG] Subscribing to the game')
    subscribeToGame(game.$id)

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
  gameStore.reset()

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

    console.log('[DEBUG] Subscribing to the game')
    subscribeToGame(response.gameID)

    gameStore.setGameID(response.gameID)
    gameStore.setHostSymbol(response.hostSymbol === 'X' ? 'O' : 'X')

    return {
      ok: true,
      message: response.message
    }
  } catch (error) {
    console.error('An error occurred while trying to join the game')
    throw error
  }
}

export async function leaveGame() {
  console.log('[DEBUG] Leaving a game')

  const gameStore = useGameStore()
  gameStore.reset()

  try {
    await useSessionStore().clearSession()
  } catch (e) {
    console.error(e)
  }
  await router.push('/')
}

export async function makeMove(index: number) {

  console.log('[DEBUG] Making a move')

  if (index < 0 || index > 8) {
    throw new Error('Invalid position')
  }

  const gameStore = useGameStore()

  gameStore.addMove(index)

  const board = Array.from(gameStore.board.values())

  // Update game document with new move
  await databases.updateDocument(
    '6596f2eb562ddd09d461',
    '6596f44fd2166b21d722',
    gameStore.gameID?.toString() || '',
    {
      moves:
        board
          .map((symbol, index) => ({
            field: index,
            player: symbol
          }))
          .filter(symbol => symbol !== null)
    }
  )
}
