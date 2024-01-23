import { Client, Databases, Query } from 'node-appwrite'

// eslint-disable-next-line no-unused-vars
export default async ({ req, res, log, error }) => {
  log('Preparing for cleanup...')

  const CURRENT_TIMESTAMP_IN_SECONDS = Math.floor(Date.now() / 1000)
  // eslint-disable-next-line no-undef
  const TIME_TO_LIVE_IN_SECONDS = process.env.TIME_TO_LIVE_IN_SECONDS !== undefined
    // eslint-disable-next-line no-undef
    ? process.env.TIME_TO_LIVE_IN_SECONDS
    : 60 * 60 * 24 * 7 // default: 7 days
  const EXPIRATION_TIMESTAMP_IN_SECONDS = CURRENT_TIMESTAMP_IN_SECONDS - TIME_TO_LIVE_IN_SECONDS

  log('Current timestamp in seconds:', CURRENT_TIMESTAMP_IN_SECONDS)
  log('Time to live in seconds:', TIME_TO_LIVE_IN_SECONDS)
  log('Expiration timestamp in seconds:', EXPIRATION_TIMESTAMP_IN_SECONDS)

  // You can log messages to the console
  log('Searching for stale documents...')

  // Create a new Appwrite SDK client
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    // eslint-disable-next-line no-undef
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    // eslint-disable-next-line no-undef
    .setKey(process.env.APPWRITE_API_KEY)

  // Create a new Appwrite SDK database instance
  const databases = new Databases(client)

  // Get a list of all documents in the sessions collection
  const documentsLits = await databases.listDocuments(
    // eslint-disable-next-line no-undef
    process.env.APPWRITE_DATABASE_ID,
    // eslint-disable-next-line no-undef
    process.env.APPWRITE_SESSIONS_COLLECTION_ID,
    [
      Query.limit(5000)
    ])
  const documents = documentsLits.documents

  log(`Found ${documents.length} documents, filtering...`)

  // Filter out documents that were not updated recently
  const staleDocuments = documents.filter(document => {
    const documentUpdatedAtInSeconds = new Date(document.$updatedAt).getTime() / 1000
    return documentUpdatedAtInSeconds < EXPIRATION_TIMESTAMP_IN_SECONDS
  })

  log(`Found ${staleDocuments.length} stale documents, deleting...`)

  // Delete all stale documents
  const promises = staleDocuments.map(document => {
    return databases.deleteDocument(
      // eslint-disable-next-line no-undef
      process.env.APPWRITE_DATABASE_ID,
      // eslint-disable-next-line no-undef
      process.env.APPWRITE_SESSIONS_COLLECTION_ID,
      document.$id
    )
  })
  await Promise.all(promises)

  log(`Successfully removed ${staleDocuments.length} stale documents`)

  return {
    status: 200,
    ok: true
  }
};
