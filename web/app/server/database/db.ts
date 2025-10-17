import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

let db: ReturnType<typeof drizzle> | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || './data/leaderboard.db'

    // Ensure directory exists
    const fs = require('fs')
    const path = require('path')
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const sqlite = new Database(dbPath)
    sqlite.pragma('journal_mode = WAL')

    db = drizzle(sqlite, { schema })

    // Run migrations
    try {
      migrate(db, { migrationsFolder: './migrations' })
    } catch (error) {
      console.log('Migrations not found or already applied')
    }
  }

  return db
}

export { schema }
