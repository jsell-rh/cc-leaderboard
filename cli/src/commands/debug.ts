import chalk from 'chalk'
import { getConfig, getApiKey } from '../config.js'
import crypto from 'crypto'

export async function debugCommand() {
  console.log(chalk.bold('\n🐛 Debug Information\n'))

  const config = getConfig()

  console.log(chalk.white('Configuration:'))
  console.log(chalk.gray('  API URL: ') + chalk.cyan(config.apiUrl))
  console.log(chalk.gray('  Auto-submit: ') + chalk.cyan(config.autoSubmit))

  // Show the hash used for the keychain account
  const hash = crypto.createHash('md5').update(config.apiUrl).digest('hex').substring(0, 8)
  console.log(chalk.gray('  Keychain account: ') + chalk.cyan(`api-key-${hash}`))

  const apiKey = await getApiKey()

  if (apiKey) {
    console.log(chalk.gray('  API Key found: ') + chalk.green('✓'))
    console.log(
      chalk.gray('  API Key (first 10 chars): ') + chalk.cyan(apiKey.substring(0, 10) + '...')
    )
    console.log(chalk.gray('  API Key length: ') + chalk.cyan(apiKey.length))
  } else {
    console.log(chalk.gray('  API Key found: ') + chalk.red('✗ (not found)'))
  }

  console.log(chalk.white('\nTesting API connection...'))

  if (!apiKey) {
    console.log(chalk.red('No API key found. Run "cc-leaderboard login" first.'))
    return
  }

  try {
    const response = await fetch(`${config.apiUrl}/api/me`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    console.log(chalk.gray('  Response status: ') + chalk.cyan(response.status))
    console.log(chalk.gray('  Response status text: ') + chalk.cyan(response.statusText))

    if (response.ok) {
      const data = (await response.json()) as { name: string; email: string }
      console.log(chalk.green('\n✓ API connection successful!'))
      console.log(chalk.gray('  User: ') + chalk.cyan(data.name))
      console.log(chalk.gray('  Email: ') + chalk.cyan(data.email))
    } else {
      const errorText = await response.text()
      console.log(chalk.red('\n✗ API connection failed'))
      console.log(chalk.gray('  Error: ') + chalk.red(errorText))
    }
  } catch (error) {
    console.log(chalk.red('\n✗ Failed to connect to API'))
    console.log(chalk.gray('  Error: ') + chalk.red((error as Error).message))
  }

  console.log()
}
