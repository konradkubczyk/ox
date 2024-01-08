import { Client, Account, Databases, Functions } from 'appwrite';

export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6595d518075324972bbb');

export const databases = new Databases(client);
export const functions = new Functions(client);
export const account = new Account(client);
export { ID } from 'appwrite';
