import { Client, Databases } from 'node-appwrite'
import { createSession } from './session.js'

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)

  const databases = new Databases(client)

  if (req.method === 'POST') {
    const sessionDetails = await createSession(client, databases, log, error)
    return res.send(sessionDetails, sessionDetails.status)
  }

  if (req.method === 'GET') {
    return res.send({ ok: false, error: 'Not Implemented' }, 501)
  }

  if (req.method === 'PATCH') {
    return res.send({ ok: false, error: 'Not Implemented' }, 501)
  }

  return res.send({ ok: false, error: 'Method Not Allowed' }, 405)
};
