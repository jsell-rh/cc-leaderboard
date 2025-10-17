#!/usr/bin/env node

import { Command } from 'commander'
import { loginCommand } from './commands/login.js'
import { submitCommand } from './commands/submit.js'
import { configCommand } from './commands/config.js'
import { statusCommand } from './commands/status.js'

const program = new Command()

program
  .name('ccleaderboard')
  .description('Submit Claude Code usage to the leaderboard')
  .version('0.1.0')

program.command('login').description('Authenticate with the leaderboard').action(loginCommand)

program
  .command('submit')
  .description('Submit your Claude Code usage data')
  .option('--date <date>', 'Date to submit (YYYY-MM-DD format, defaults to today)')
  .option('--all', 'Import all historical usage data')
  .action(submitCommand)

program
  .command('config')
  .description('Configure auto-submit settings')
  .option('--auto-submit <schedule>', 'Enable auto-submit (daily, weekly, off)')
  .action(configCommand)

program
  .command('status')
  .description('Show current configuration and recent submissions')
  .action(statusCommand)

program.parse()
