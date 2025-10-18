import chalk from 'chalk'
import open from 'open'
import ora from 'ora'
import { getConfig, setApiKey, setConfig } from '../config.js'

export async function loginCommand() {
  const config = getConfig()

  // Check if API URL is still the default localhost
  const isDefaultUrl = config.apiUrl === 'http://localhost:3001'

  if (isDefaultUrl) {
    console.log(
      chalk.yellow('\n⚠️  API URL not configured') +
        chalk.gray(' (currently: http://localhost:3001)\n')
    )
    console.log(chalk.white('Your team likely has a dedicated leaderboard instance.'))

    const readline = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const shouldConfigure = await new Promise<string>((resolve) => {
      rl.question(chalk.cyan('Would you like to configure it now? (Y/n): '), (answer) => {
        resolve(answer.trim().toLowerCase() || 'y')
      })
    })

    if (shouldConfigure === 'y' || shouldConfigure === 'yes') {
      const apiUrl = await new Promise<string>((resolve) => {
        rl.question(chalk.yellow("\nEnter your team's leaderboard URL: "), (answer) => {
          rl.close()
          resolve(answer.trim())
        })
      })

      if (!apiUrl) {
        console.log(chalk.red('\n❌ API URL is required'))
        process.exit(1)
      }

      // Validate URL format
      try {
        new URL(apiUrl)
      } catch (error) {
        console.log(
          chalk.red('\n❌ Invalid URL format. Please include the protocol (https:// or http://)')
        )
        process.exit(1)
      }

      // Save the API URL
      const cleanUrl = apiUrl.replace(/\/$/, '') // Remove trailing slash
      setConfig('apiUrl', cleanUrl)
      console.log(chalk.green(`✓ API URL configured: ${cleanUrl}\n`))

      // Update config reference
      config.apiUrl = cleanUrl
    } else {
      rl.close()
      console.log(
        chalk.yellow('\n⚠️  Continuing with localhost. This will likely fail to connect.\n')
      )
    }
  }

  console.log(chalk.bold('🔐 Login to Claude Code Leaderboard\n'))

  const authUrl = `${config.apiUrl}/auth/cli-login`
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
        chalk.cyan('cc-leaderboard submit') +
        chalk.white(' to submit your usage')
    )
    console.log(
      chalk.white('  • Run ') +
        chalk.cyan('cc-leaderboard config --auto-submit daily') +
        chalk.white(' to enable auto-submit')
    )
    console.log()
  } catch (error) {
    spinner.fail('Authentication failed')
    console.error(chalk.red('\n' + (error as Error).message))
    process.exit(1)
  }
}
