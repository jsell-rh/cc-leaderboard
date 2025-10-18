#!/usr/bin/env node

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { Command } from 'commander'
import { loginCommand } from './commands/login.js'
import { submitCommand } from './commands/submit.js'
import { configCommand } from './commands/config.js'
import { statusCommand } from './commands/status.js'
import { checkSessionsCommand } from './commands/check-sessions.js'

// Read version from package.json dynamically
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'))

const program = new Command()

program
  .name('cc-leaderboard')
  .description("Submit Claude Code usage to your team's leaderboard")
  .version(packageJson.version)

program
  .command('config')
  .description("Configure your team's leaderboard URL and settings (run this first!)")
  .option('--api-url <url>', "Set the API URL for your team's leaderboard server")
  .option('--auto-submit <schedule>', 'Enable auto-submit (daily, weekly, off)')
  .action(configCommand)

program
  .command('login')
  .description('Authenticate with the leaderboard via GitHub')
  .action(loginCommand)

program
  .command('submit')
  .description('Submit your Claude Code usage data')
  .option('--date <date>', 'Date to submit (YYYY-MM-DD format, defaults to today)')
  .option('--all', 'Import all historical usage data')
  .action(submitCommand)

program
  .command('status')
  .description('Show current configuration and recent submissions')
  .action(statusCommand)

program
  .command('check-sessions')
  .description('Check for large Claude Code session files that may cause issues')
  .action(checkSessionsCommand)

program.parse()
