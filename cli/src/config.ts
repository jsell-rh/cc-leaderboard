import Conf from 'conf'
import keytar from 'keytar'

const SERVICE_NAME = 'ccleaderboard'
const API_KEY_ACCOUNT = 'api-key'

export interface Config {
  apiUrl: string
  autoSubmit: 'off' | 'daily' | 'weekly'
  lastSubmission?: string
}

const config = new Conf<Config>({
  projectName: 'ccleaderboard',
  defaults: {
    apiUrl: 'http://localhost:3000',
    autoSubmit: 'off'
  }
})

export function getConfig(): Config {
  return config.store
}

export function setConfig(key: keyof Config, value: any) {
  config.set(key, value)
}

export async function getApiKey(): Promise<string | null> {
  return await keytar.getPassword(SERVICE_NAME, API_KEY_ACCOUNT)
}

export async function setApiKey(apiKey: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, API_KEY_ACCOUNT, apiKey)
}

export async function deleteApiKey(): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, API_KEY_ACCOUNT)
}
