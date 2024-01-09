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
