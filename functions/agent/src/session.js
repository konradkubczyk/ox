import { ID } from 'node-appwrite'

import { generateToken } from './utils.js'

export async function createSession(client, databases, log, error, player1Mark = 'X') {
  const player1Key = generateToken()
  const player2Key = generateToken()
  const inviteCode = generateToken()

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
          turn: Math.random() > 0.5 ? '1' : '2',
          finished: false
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
    player1Key,
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
    player2Key: session.player2Key
  }
}
