import { Client, Databases } from 'node-appwrite'
import { createSession, joinSession, makeMove } from './session.js'

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    // eslint-disable-next-line no-undef
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    // eslint-disable-next-line no-undef
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
      req.headers['session-id'],
      req.headers['invite-code']
    )
    return res.send(response, response.status)
  }

  if (req.method === 'PATCH') {
    const response = await makeMove(
      client,
      databases,
      log,
      error,
      req.headers['session-id'],
      req.headers['player-key'],
      req.body.position
    )
    return res.send(response, response.status)
  }

  return res.send({ ok: false, error: 'Method Not Allowed' }, 405)
};
