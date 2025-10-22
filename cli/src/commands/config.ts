import chalk from 'chalk'
import cron from 'node-cron'
import { execSync } from 'child_process'
import { homedir, tmpdir } from 'os'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { getConfig, setConfig } from '../config.js'

async function setupCronJob(schedule: 'daily' | 'weekly') {
  try {
    // Detect shell config file
    const home = homedir()
    const shellConfigs = ['.bashrc', '.bash_profile', '.zshrc', '.profile']
    const shellConfig = shellConfigs.find((config) => existsSync(`${home}/${config}`)) || '.bashrc'

    // Find npx path - try multiple methods
    let npxPath: string
    try {
      // Try which npx first
      npxPath = execSync('which npx', { encoding: 'utf-8' }).trim()
    } catch {
      // Fallback to common NVM location
      try {
        const nodeVersion = process.version.slice(1) // Remove 'v' prefix
        const nvmPath = `${home}/.nvm/versions/node/v${nodeVersion}/bin/npx`
        if (existsSync(nvmPath)) {
          npxPath = nvmPath
        } else {
          // Try to find any npx in NVM
          const nvmNodeDir = `${home}/.nvm/versions/node`
          if (existsSync(nvmNodeDir)) {
            const versions = execSync(`ls -1 ${nvmNodeDir}`, { encoding: 'utf-8' })
              .trim()
              .split('\n')
            if (versions.length > 0) {
              npxPath = `${nvmNodeDir}/${versions[versions.length - 1]}/bin/npx`
            } else {
              throw new Error('Could not find npx')
            }
          } else {
            throw new Error('Could not find npx')
          }
        }
      } catch {
        // Last resort - use system npx
        npxPath = '/usr/bin/npx'
      }
    }

    // Determine cron schedule
    let cronSchedule: string
    if (schedule === 'daily') {
      cronSchedule = '0 18 * * *' // Daily at 6 PM
    } else {
      cronSchedule = '0 18 * * 0' // Weekly on Sunday at 6 PM
    }

    // Create the cron command with proper environment sourcing
    const cronCommand = `/usr/bin/bash -c ". ${home}/${shellConfig} && ${npxPath} -y cc-leaderboard submit"`
    const cronEntry = `${cronSchedule} ${cronCommand}`

    // Get existing crontab
    let existingCrontab = ''
    try {
      existingCrontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' })
    } catch {
      // No existing crontab, that's fine
    }

    // Remove any existing cc-leaderboard entries
    const lines = existingCrontab.split('\n').filter((line) => !line.includes('cc-leaderboard'))

    // Add new entry
    lines.push(`# cc-leaderboard auto-submit (${schedule})`)
    lines.push(cronEntry)

    // Install new crontab using temp file approach (avoids permission issues)
    const newCrontab = lines.join('\n') + '\n'
    const tmpFile = join(tmpdir(), `crontab-${Date.now()}.tmp`)
    try {
      writeFileSync(tmpFile, newCrontab)
      execSync(`crontab "${tmpFile}"`)
      unlinkSync(tmpFile)
    } catch (error) {
      try {
        unlinkSync(tmpFile)
      } catch {}
      throw error
    }

    console.log(chalk.green('✓ Cron job installed successfully!'))
    console.log(chalk.gray('\nSchedule: ') + chalk.white(cronSchedule))
    console.log(chalk.gray('Command: ') + chalk.white(cronCommand))
    console.log()
    console.log(chalk.gray('You can view your crontab with: ') + chalk.cyan('crontab -l'))
    console.log(
      chalk.gray('You can edit it manually with: ') +
        chalk.cyan('crontab -e') +
        chalk.gray(' if needed')
    )
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  Could not automatically set up cron job'))
    console.log(chalk.gray('Please set it up manually using the instructions below:\n'))
    throw error
  }
}

async function removeCronJob() {
  try {
    // Get existing crontab
    let existingCrontab = ''
    try {
      existingCrontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' })
    } catch {
      // No existing crontab
      return
    }

    // Remove cc-leaderboard entries
    const lines = existingCrontab.split('\n').filter((line) => !line.includes('cc-leaderboard'))

    // Install updated crontab
    if (lines.length > 0 && lines.some((line) => line.trim() !== '')) {
      const newCrontab = lines.join('\n') + '\n'
      const tmpFile = join(tmpdir(), `crontab-${Date.now()}.tmp`)
      try {
        writeFileSync(tmpFile, newCrontab)
        execSync(`crontab "${tmpFile}"`)
        unlinkSync(tmpFile)
      } catch (error) {
        try {
          unlinkSync(tmpFile)
        } catch {}
        throw error
      }
    } else {
      // Remove crontab entirely if empty
      try {
        execSync('crontab -r')
      } catch {
        // Ignore errors - crontab might already be empty
      }
    }

    console.log(chalk.green('✓ Cron job removed'))
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  Could not automatically remove cron job'))
    console.log(chalk.gray('Please remove it manually with: ') + chalk.cyan('crontab -e'))
  }
}

export async function configCommand(options: { autoSubmit?: string; apiUrl?: string }) {
  console.log(chalk.bold('\n⚙️  Configure cc-leaderboard\n'))

  // Handle API URL configuration
  if (options.apiUrl) {
    const url = options.apiUrl.replace(/\/$/, '') // Remove trailing slash

    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      console.log(
        chalk.red('\n❌ Invalid URL format. Please include the protocol (https:// or http://)')
      )
      console.log(chalk.gray('Example: https://cc-leaderboard.your-company.com'))
      process.exit(1)
    }

    setConfig('apiUrl', url)
    console.log(chalk.green(`✓ API URL configured: ${url}`))
    console.log(chalk.gray('\nNext steps:'))
    console.log(
      chalk.white('  Run ') +
        chalk.cyan('npx cc-leaderboard login') +
        chalk.white(' to authenticate')
    )
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
      await removeCronJob()
      console.log(chalk.green('✓ Auto-submit disabled'))
    } else {
      console.log(chalk.green(`✓ Auto-submit enabled: ${schedule}`))
      console.log()

      // Attempt to set up cron job automatically
      try {
        await setupCronJob(schedule as 'daily' | 'weekly')
      } catch (error) {
        // Show manual instructions as fallback
        console.log(chalk.white('Manual setup instructions:'))
        console.log(chalk.gray('  Run: ') + chalk.cyan('crontab -e'))
        console.log(chalk.gray('  Add this line:\n'))

        const home = homedir()
        const shellConfigs = ['.bashrc', '.bash_profile', '.zshrc', '.profile']
        const shellConfig =
          shellConfigs.find((config) => existsSync(`${home}/${config}`)) || '.bashrc'

        if (schedule === 'daily') {
          console.log(
            chalk.white(
              `  0 18 * * * /usr/bin/bash -c ". ${home}/${shellConfig} && npx -y cc-leaderboard submit"`
            )
          )
          console.log(chalk.gray('\n  This runs every day at 6 PM'))
        } else if (schedule === 'weekly') {
          console.log(
            chalk.white(
              `  0 18 * * 0 /usr/bin/bash -c ". ${home}/${shellConfig} && npx -y cc-leaderboard submit"`
            )
          )
          console.log(chalk.gray('\n  This runs every Sunday at 6 PM'))
        }
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
