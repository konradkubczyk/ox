import { Client, Databases } from 'node-appwrite'
import { createSession, joinSession, makeMove } from './session.js'

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)

  const databases = new Databases(client)

  if (req.method === 'POST') {
    const response = await createSession(client, databases, log, error)
    return res.send(response, response.status)
  }

  if (req.method === 'GET') {
    const response = await joinSession(client,
      databases,
      log,
      error,
      req.query.sessionId,
      req.query.inviteCode
    )
    return res.send(response, response.status)
  }

  if (req.method === 'PATCH') {
    const response = await makeMove(
      client,
      databases,
      log,
      error,
      req.query.sessionId,
      req.query.gameId,
      req.query.playerKey,
      req.query.position
    )
    return res.send(response, response.status)
  }

  return res.send({ ok: false, error: 'Method Not Allowed' }, 405)
};
