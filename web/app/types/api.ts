// API Response Types

export interface UserData {
  id: string
  name: string
  email: string
  avatar: string | null
  apiKey: string
  createdAt: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string | null
  totalCost: number
  totalInputTokens: number
  totalOutputTokens: number
  submissionCount: number
}

export interface LeaderboardResponse {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time'
  leaderboard: LeaderboardEntry[]
}
