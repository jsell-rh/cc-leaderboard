import Conf from 'conf'
import keytar from 'keytar'
import crypto from 'crypto'

const SERVICE_NAME = 'cc-leaderboard'

export interface Config {
  apiUrl: string
  autoSubmit: 'off' | 'daily' | 'weekly'
  lastSubmission?: string
}

const config = new Conf<Config>({
  projectName: 'cc-leaderboard',
  defaults: {
    apiUrl: 'http://localhost:3001',
    autoSubmit: 'off',
  },
})

export function getConfig(): Config {
  return config.store
}

export function setConfig(key: keyof Config, value: any) {
  config.set(key, value)
}

/**
 * Generate a unique account identifier for the API key based on the URL
 * This allows different API keys for different leaderboard instances
 */
function getApiKeyAccount(apiUrl: string): string {
  // Create a hash of the URL to use as the account identifier
  const hash = crypto.createHash('md5').update(apiUrl).digest('hex').substring(0, 8)
  return `api-key-${hash}`
}

export async function getApiKey(apiUrl?: string): Promise<string | null> {
  const url = apiUrl || getConfig().apiUrl
  const account = getApiKeyAccount(url)
  return await keytar.getPassword(SERVICE_NAME, account)
}

export async function setApiKey(apiKey: string, apiUrl?: string): Promise<void> {
  const url = apiUrl || getConfig().apiUrl
  const account = getApiKeyAccount(url)
  await keytar.setPassword(SERVICE_NAME, account, apiKey)
}

export async function deleteApiKey(apiUrl?: string): Promise<void> {
  const url = apiUrl || getConfig().apiUrl
  const account = getApiKeyAccount(url)
  await keytar.deletePassword(SERVICE_NAME, account)
}
