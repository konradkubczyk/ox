import {Client, Databases, Query, Permission} from 'node-appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

export default async ({req, res, log, error}) => {
  if (req.method !== 'POST') {
    error('Method Not Allowed');
    return res.send({ok: false, error: 'Method Not Allowed'}, 405);
  }

  const userID = req.headers['x-appwrite-user-id'];
  const invitationToken = req.body.invitationToken;

  const games = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    [Query.equal("invitationToken", invitationToken)]
  );

  if (games.total === 0) {
    error('Invitation token not found');
    return res.send({ok: false, error: `No games found with invitation token ${invitationToken}`}, 404);
  }

  const game = games.documents[0];

  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    game.$id,
    {
      invitationToken: null,
    },
    [
      `read("user:${userID}")`, // Add read permission for the new user
      `update("user:${userID}")`, // Add write permission for the new user
    ]
  );

  return res.json({
    ok: true,
    message: `Successfully connected user ${userID} to game ${game.$id} with invitation token ${invitationToken}`,
    userID,
    gameID: game.$id,
    invitationToken
  })
};
