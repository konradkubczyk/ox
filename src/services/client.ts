import { useSessionStore } from '@/stores/session'
import { client, databases, functions } from '@/lib/appwrite'
import { AGENT_FUNCTION_ID, DATABASE_ID, GAMES_COLLECTION_ID } from '@/config/api'
import { useGameStore } from '@/stores/game'
import type { RealtimeResponseEvent } from 'appwrite'

export async function createGame() {
  const execution = await functions.createExecution(
    AGENT_FUNCTION_ID,
    '{}',
    false,
    '/',
    'POST',
    {
      'Content-Type': 'application/json'
    }
  )

  const response = await JSON.parse(execution.responseBody)

  if (!response.ok) {
    throw new Error('An error occurred while creating the game.')
  }

  const sessionStore = useSessionStore()

  sessionStore.clear()
  sessionStore.setSessionId(response.sessionId)
  sessionStore.setGameId(response.gameId)
  sessionStore.setPlayerKey(response.playerKey)
  sessionStore.setInviteCode(response.inviteCode)
  sessionStore.setPlayer('1')

  return response
}

export async function joinGame(sessionId: string, inviteCode: string) {
  const execution = await functions.createExecution(
    AGENT_FUNCTION_ID,
    '{}',
    false,
    '/',
    'GET',
    {
      'Content-Type': 'application/json',
      'Session-ID': sessionId,
      'Invite-Code': inviteCode
    }
  )

  const response = await JSON.parse(execution.responseBody)

  if (!response.ok) {
    throw new Error('An error occurred while joining the game.')
  }

  const sessionStore = useSessionStore()

  sessionStore.clear()
  sessionStore.setSessionId(response.sessionId)
  sessionStore.setGameId(response.gameId)
  sessionStore.setPlayerKey(response.playerKey)
  sessionStore.setPlayer('2')

  return response
}

export async function makeMove(position: number) {
  const sessionStore = useSessionStore()

  const gameStore = useGameStore()
  gameStore.setPositions(gameStore.positions.map((field, index) => {
    if (index === position) {
      return { position, player: sessionStore.player }
    }

    return field
  }))
  gameStore.setTurn(sessionStore.player === '1' ? '2' : '1')

  const execution = await functions.createExecution(
    AGENT_FUNCTION_ID,
    JSON.stringify({ position: position.toString() }),
    false,
    '/',
    'PATCH',
    {
      'Content-Type': 'application/json',
      'Session-ID': sessionStore.sessionId,
      'Player-Key': sessionStore.playerKey
    }
  )

  const response = await JSON.parse(execution.responseBody)

  if (!response.ok) {
    throw new Error('An error occurred while making a move.')
  }

  return response
}

export async function connectToGame(gameId: string) {
  return client.subscribe(`databases.${DATABASE_ID}.collections.${GAMES_COLLECTION_ID}.documents.${gameId}`, (response: RealtimeResponseEvent<any>) => {
    const gameStore = useGameStore()

    gameStore.setTurn(response.payload.turn)
    gameStore.setPositions(JSON.parse(response.payload.positions))
    gameStore.setPlayer1Wins(response.payload.player1Wins)
    gameStore.setPlayer2Wins(response.payload.player2Wins)
    gameStore.setGameNumber(response.payload.gameNumber)
  })
}

export async function loadGame(gameId: string) {
  const document = await databases.getDocument(DATABASE_ID, GAMES_COLLECTION_ID, gameId)
  const gameStore = useGameStore()

  gameStore.setTurn(document.turn)
  gameStore.setPositions(JSON.parse(document.positions))
  gameStore.setPlayer1Wins(document.player1Wins)
  gameStore.setPlayer2Wins(document.player2Wins)
  gameStore.setGameNumber(document.gameNumber)

  return document
}
