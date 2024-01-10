import { Client, Account, Databases, Functions } from 'appwrite'
import { API_BASE_URL, PROJECT_ID } from '@/config/api'

export const client = new Client()

client
  .setEndpoint(API_BASE_URL)
  .setProject(PROJECT_ID)

export const databases = new Databases(client)
export const functions = new Functions(client)
export const account = new Account(client)
export { ID } from 'appwrite'
