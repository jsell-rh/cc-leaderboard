import type { Config } from 'drizzle-kit'

export default {
  schema: './app/server/database/schema.ts',
  out: './migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/leaderboard.db'
  }
} satisfies Config
