import { ID } from 'node-appwrite'

import { checkWin, generateToken } from './utils.js'

export async function createSession(client, databases, log, error, playerMark) {
  const player1Key = generateToken()
  const player2Key = generateToken()
  const inviteCode = generateToken()
  const player1Mark = playerMark || (Math.random() > 0.5 ? 'X' : 'O')
  const turn = Math.random() > 0.5 ? '1' : '2'

  const positions = []

  for (let i = 0; i < 9; i++) {
    positions.push({
      position: i,
      player: null
    })
  }

  const session = await databases.createDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    ID.unique(),
    {
      player1Key,
      player2Key,
      inviteCode,
      player1Mark,
      player1Wins: 0,
      player2Wins: 0,
      games: [
        {
          turn,
          finished: false,
          positions: JSON.stringify(positions)
        }
      ]
    }
  )

  return {
    status: 200,
    ok: true,
    message: `Successfully created session ${session.$id}`,
    sessionId: session.$id,
    gameId: session['games'][0].$id,
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
    gameId: session['games'][0].$id,
    playerKey: session.player2Key
  }
}

export async function makeMove(client, databases, log, error, sessionId, gameId, playerKey, position) {

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

  const game = session.games.find((game) => game.$id === gameId)

  if (!game) {
    error('Game not found')
    return {
      status: 404,
      ok: false,
      error: 'Game not found'
    }
  }

  if (game.finished) {
    error('Game already finished')
    return {
      status: 409,
      ok: false,
      error: 'Game already finished'
    }
  }

  if (game.turn !== player) {
    error('Not your turn')
    return {
      status: 409,
      ok: false,
      error: 'Not your turn'
    }
  }

  const positions = JSON.parse(game.positions)

  if (positions[position].player) {
    error('Position already taken')
    return {
      status: 409,
      ok: false,
      error: 'Position already taken'
    }
  }

  positions[position].player = player
  game.winner = checkWin(positions)

  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    sessionId,
    {
      games: [
        {
          $id: gameId,
          turn: player === '1' ? '2' : '1',
          finished: Boolean(game.winner || positions.every((position) => position.player)),
          winner: game.winner,
          positions: JSON.stringify(positions)
        }
      ]
    }
  )

  if (game.winner) {
    session[`player${game.winner}Wins`] += 1
    return {
      status: 200,
      ok: true,
      message: `Player ${game.winner} won the game`
    }
  }

  return {
    status: 200,
    ok: true,
    message: `Successfully made move ${position}`
  }
}
