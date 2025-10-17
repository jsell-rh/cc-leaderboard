import chalk from 'chalk'
import ora from 'ora'
import { getConfig, getApiKey } from '../config.js'
import { getUserInfo } from '../api-client.js'

export async function statusCommand() {
  console.log(chalk.bold('\n📈 ccleaderboard Status\n'))

  const spinner = ora('Checking authentication...').start()

  try {
    const apiKey = await getApiKey()

    if (!apiKey) {
      spinner.fail('Not authenticated')
      console.log(chalk.yellow('\nRun ') + chalk.cyan('ccleaderboard login') + chalk.yellow(' to get started'))
      process.exit(1)
    }

    spinner.text = 'Fetching user info...'
    const userInfo = await getUserInfo()

    spinner.succeed('Authenticated')

    console.log(chalk.white('\nUser:'))
    console.log(chalk.gray('  Name: ') + chalk.cyan(userInfo.name))
    console.log(chalk.gray('  Email: ') + chalk.cyan(userInfo.email))
    console.log(chalk.gray('  Member since: ') + chalk.cyan(new Date(userInfo.createdAt).toLocaleDateString()))

    const config = getConfig()

    console.log(chalk.white('\nConfiguration:'))
    console.log(chalk.gray('  API URL: ') + chalk.cyan(config.apiUrl))
    console.log(chalk.gray('  Auto-submit: ') + chalk.cyan(config.autoSubmit))

    if (config.lastSubmission) {
      const lastDate = new Date(config.lastSubmission)
      console.log(chalk.gray('  Last submission: ') + chalk.cyan(lastDate.toLocaleString()))
    }

    console.log()

  } catch (error) {
    spinner.fail('Failed to fetch status')
    console.error(chalk.red('\n' + (error as Error).message))
    process.exit(1)
  }
}
