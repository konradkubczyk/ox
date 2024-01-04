import sdk from "node-appwrite";

const client = new sdk.Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new sdk.Users(client);

const currentTimeStamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
const timeLimitSeconds = process.env.TIME_LIMIT_SECONDS; // Read time limit from env var, default to 10 minutes
const thresholdTimestamp = currentTimeStamp - timeLimitSeconds;

export default async ({ req, res, log, error }) => {
    log('Starting user cleaner function...');
    try {
        const userList = await users.list(); // Get a list of all users
        log('User list fetched successfully')

        for (const user of userList.users) {
            const lastAccess = user['accessedAt'];
            if (lastAccess < thresholdTimestamp) {
                log(`Deleting user: ${user.name} - ID: ${user.$id}`);
                await users.delete(user.$id); // Delete the user
            }
        }
        log('Old users removed successfully');
    } catch (error) {
        error('Error removing old users:', error);
    }

    return res.send('Cleanup complete', 200);
}
