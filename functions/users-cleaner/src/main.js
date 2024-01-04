import sdk from "node-appwrite";

const client = new sdk.Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new sdk.Users(client);

const currentTimeStamp = Date.now(); // Get current timestamp in seconds
const timeLimitSeconds = process.env.TIME_LIMIT_SECONDS * 1000; // Read time limit from env var, default to 10 minutes
const thresholdTimestamp = currentTimeStamp - timeLimitSeconds;

export default async ({ req, res, log, error }) => {
    log('Starting user cleaner function with the following parameters:');
    log(`- current timestamp: ${currentTimeStamp}`);
    log(`- time limit: ${timeLimitSeconds}`);
    log(`- threshold timestamp: ${thresholdTimestamp}`);
    let deletedUsersCount = 0;
    try {
        const userList = await users.list(); // Get a list of all users
        log('User list fetched successfully')
        for (const user of userList.users) {
            log(`Checking user ${JSON.stringify(user)}`);
            const lastAccess = new Date(user['accessedAt']).getTime();
            log(`- last access: ${lastAccess}`);
            log(`- time passed: ${currentTimeStamp - lastAccess}`);
            if (lastAccess < thresholdTimestamp) {
                await users.delete(user.$id); // Delete the user
                deletedUsersCount++;
            }
        }
        log(`Deleted ${deletedUsersCount} users`);
    } catch (error) {
        error('Error removing old users:', error);
    }

    return res.send('Cleanup complete', 200);
}
