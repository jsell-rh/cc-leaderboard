import { getConfig, getApiKey } from './config.js'

export interface SubmissionData {
  date: string
  dailyCost: number
  modelBreakdown: Record<string, number>
  inputTokens: number
  outputTokens: number
}

export async function submitUsage(
  data: SubmissionData
): Promise<{ success: boolean; updated: boolean }> {
  const config = getConfig()
  const apiKey = await getApiKey()

  if (!apiKey) {
    throw new Error('Not authenticated. Run "cc-leaderboard login" first.')
  }

  const response = await fetch(`${config.apiUrl}/api/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: response.statusText }))) as {
      message?: string
    }
    throw new Error(`Failed to submit: ${error.message || response.statusText}`)
  }

  return (await response.json()) as { success: boolean; updated: boolean }
}

export async function getUserInfo(): Promise<any> {
  const config = getConfig()
  const apiKey = await getApiKey()

  if (!apiKey) {
    throw new Error('Not authenticated. Run "cc-leaderboard login" first.')
  }

  const response = await fetch(`${config.apiUrl}/api/me`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!(response.status === 200)) {
    throw new Error('Failed to fetch user info')
  }

  return await response.json()
}
