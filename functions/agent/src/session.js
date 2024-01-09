import { ID } from 'node-appwrite'

import { checkWin, emptyPositions, generateToken } from './utils.js'

export async function createSession(client, databases, log, error, playerMark) {
  const player1Key = generateToken()
  const player2Key = generateToken()
  const inviteCode = generateToken()
  const player1Mark = playerMark || (Math.random() > 0.5 ? 'X' : 'O')
  const turn = Math.random() > 0.5 ? '1' : '2'

  const positions = emptyPositions()

  const session = await databases.createDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    ID.unique(),
    {
      player1Key,
      player2Key,
      inviteCode,
      player1Mark,
      game: {
        turn,
        finished: false,
        positions: JSON.stringify(positions),
        player1Wins: 0,
        player2Wins: 0,
        gameNumber: 1
      }
    }
  )

  return {
    status: 200,
    ok: true,
    message: `Successfully created session ${session.$id}`,
    sessionId: session.$id,
    gameId: session.game.$id,
    playerKey: player1Key,
    inviteCode
  }
}

export async function joinSession(client, databases, log, error, sessionId, inviteCode) {

  if (!sessionId) {
    error('Session ID not provided')
    return {
      status: 400,
      ok: false,
      error: 'Session ID not provided'
    }
  }

  if (!inviteCode) {
    error('Invite code not provided')
    return {
      status: 400,
      ok: false,
      error: 'Invite code not provided'
    }
  }

  const session = await databases.getDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    sessionId
  ).catch((err) => {
    error(err)
    return null
  })

  if (!session) {
    error('Session not found')
    return {
      status: 404,
      ok: false,
      error: 'Session not found'
    }
  }

  if (!session.inviteCode) {
    error('Session already joined')
    return {
      status: 409,
      ok: false,
      error: 'Session already joined'
    }
  }

  if (session.inviteCode !== inviteCode) {
    error('Invalid invite code')
    return {
      status: 403,
      ok: false,
      error: 'Invalid invite code'
    }
  }

  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    sessionId,
    {
      inviteCode: null
    }
  )

  return {
    status: 200,
    ok: true,
    message: `Successfully joined session ${sessionId}`,
    sessionId,
    gameId: session.game.$id,
    playerKey: session.player2Key
  }
}

export async function makeMove(client, databases, log, error, sessionId, gameId, playerKey, position) {

  if (position < 0 || position > 8) {
    error('Invalid position')
    return {
      status: 400,
      ok: false,
      error: 'Invalid position'
    }
  }

  if (!sessionId) {
    error('Session ID not provided')
    return {
      status: 400,
      ok: false,
      error: 'Session ID not provided'
    }
  }

  if (!gameId) {
    error('Game ID not provided')
    return {
      status: 400,
      ok: false,
      error: 'Game ID not provided'
    }
  }

  if (!playerKey) {
    error('Player key not provided')
    return {
      status: 400,
      ok: false,
      error: 'Player key not provided'
    }
  }

  if (!position) {
    error('Position not provided')
    return {
      status: 400,
      ok: false,
      error: 'Position not provided'
    }
  }

  const session = await databases.getDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    sessionId
  ).catch((err) => {
    error(err)
    return null
  })

  if (!session) {
    error('Session not found')
    return {
      status: 404,
      ok: false,
      error: 'Session not found'
    }
  }

  if (session.player1Key !== playerKey && session.player2Key !== playerKey) {
    error('Invalid player key')
    return {
      status: 403,
      ok: false,
      error: 'Invalid player key'
    }
  }

  const player = session.player1Key === playerKey ? '1' : '2'

  if (session.game.finished) {
    error('Game already finished')
    return {
      status: 409,
      ok: false,
      error: 'Game already finished'
    }
  }

  if (session.game.turn !== player) {
    error('Not your turn')
    return {
      status: 409,
      ok: false,
      error: 'Not your turn'
    }
  }

  const positions = JSON.parse(session.game.positions)

  if (positions[position].player) {
    error('Position already taken')
    return {
      status: 409,
      ok: false,
      error: 'Position already taken'
    }
  }

  positions[position].player = player
  session.game.winner = checkWin(positions)
  const gameFinished = Boolean(session.game.winner || positions.every((position) => position.player))

  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    sessionId,
    {
      game: {
        $id: gameId,
        turn: player === '1' ? '2' : '1',
        finished: gameFinished,
        winner: session.game.winner,
        positions: gameFinished ? JSON.stringify(emptyPositions()) : JSON.stringify(positions),
        player1Wins: session.game.winner === '1' ? session.game.player1Wins + 1 : session.game.player1Wins,
        player2Wins: session.game.winner === '2' ? session.game.player1Wins + 1 : session.game.player1Wins,
        gameNumber: gameFinished ? session.game.gameNumber + 1 : session.game.gameNumber
      }
    }
  )

  return {
    status: 200,
    ok: true,
    message: `Successfully made move ${position}`
  }
}
