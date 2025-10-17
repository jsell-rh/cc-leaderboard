import chalk from 'chalk'
import cron from 'node-cron'
import { getConfig, setConfig } from '../config.js'

export async function configCommand(options: { autoSubmit?: string; apiUrl?: string }) {
  console.log(chalk.bold('\n⚙️  Configure ccleaderboard\n'))

  // Handle API URL configuration
  if (options.apiUrl) {
    const url = options.apiUrl.replace(/\/$/, '') // Remove trailing slash
    setConfig('apiUrl', url)
    console.log(chalk.green(`✓ API URL set to: ${url}`))
    console.log()
  }

  if (options.autoSubmit) {
    const schedule = options.autoSubmit.toLowerCase()

    if (!['daily', 'weekly', 'off'].includes(schedule)) {
      console.error(chalk.red('Invalid schedule. Must be one of: daily, weekly, off'))
      process.exit(1)
    }

    setConfig('autoSubmit', schedule as any)

    if (schedule === 'off') {
      console.log(chalk.green('✓ Auto-submit disabled'))
    } else {
      console.log(chalk.green(`✓ Auto-submit enabled: ${schedule}`))
      console.log(chalk.gray('\nNext steps:'))
      console.log(chalk.white('  Set up a cron job or use a task scheduler to run:'))
      console.log(chalk.cyan(`  ccleaderboard submit`))
      console.log()

      if (schedule === 'daily') {
        console.log(chalk.gray('  Example cron (every day at 6 PM):'))
        console.log(chalk.white('  0 18 * * * npx cc-leaderboard submit'))
      } else if (schedule === 'weekly') {
        console.log(chalk.gray('  Example cron (every Sunday at 6 PM):'))
        console.log(chalk.white('  0 18 * * 0 npx cc-leaderboard submit'))
      }
    }
  } else {
    // Show current config
    const config = getConfig()

    console.log(chalk.white('Current configuration:'))
    console.log(chalk.gray('  API URL: ') + chalk.cyan(config.apiUrl))
    console.log(chalk.gray('  Auto-submit: ') + chalk.cyan(config.autoSubmit))

    if (config.lastSubmission) {
      const lastDate = new Date(config.lastSubmission)
      console.log(chalk.gray('  Last submission: ') + chalk.cyan(lastDate.toLocaleString()))
    }
  }

  console.log()
}
