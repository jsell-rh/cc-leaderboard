import chalk from 'chalk'
import open from 'open'
import ora from 'ora'
import { getConfig, setApiKey } from '../config.js'

export async function loginCommand() {
  const config = getConfig()

  console.log(chalk.bold('\n🔐 Login to Claude Code Leaderboard\n'))

  const authUrl = `${config.apiUrl}/api/auth/github?source=cli`
  const spinner = ora('Opening browser for authentication...').start()

  try {
    // Open browser to auth page
    await open(authUrl)

    spinner.succeed('Browser opened')

    console.log(chalk.cyan('\n📋 Please complete the following steps:'))
    console.log(chalk.gray(`   If the browser didn't open, visit: ${authUrl}\n`))
    console.log(chalk.white('  1. Sign in with GitHub'))
    console.log(chalk.white('  2. Authorize the application'))
    console.log(chalk.white('  3. Copy your API key from the Settings page'))
    console.log(chalk.white('  4. Paste it below'))
    console.log()

    // Wait for user to paste API key
    const readline = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const apiKey = await new Promise<string>((resolve) => {
      rl.question(chalk.yellow('Paste your API key here: '), (answer) => {
        rl.close()
        resolve(answer.trim())
      })
    })

    if (!apiKey) {
      throw new Error('API key is required')
    }

    // Store API key
    await setApiKey(apiKey)

    console.log(chalk.green('\n✓ Successfully authenticated!'))
    console.log(chalk.gray('\nNext steps:'))
    console.log(
      chalk.white('  • Run ') +
        chalk.cyan('ccleaderboard submit') +
        chalk.white(' to submit your usage')
    )
    console.log(
      chalk.white('  • Run ') +
        chalk.cyan('ccleaderboard config --auto-submit daily') +
        chalk.white(' to enable auto-submit')
    )
    console.log()
  } catch (error) {
    spinner.fail('Authentication failed')
    console.error(chalk.red('\n' + (error as Error).message))
    process.exit(1)
  }
}
