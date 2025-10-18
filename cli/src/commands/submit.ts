import chalk from 'chalk'
import ora from 'ora'
import { exec } from 'child_process'
import { promisify } from 'util'
import { submitUsage } from '../api-client.js'
import { setConfig } from '../config.js'

const execAsync = promisify(exec)

interface CcusageModelBreakdown {
  modelName: string
  inputTokens: number
  outputTokens: number
  cacheCreationTokens?: number
  cacheReadTokens?: number
  totalTokens: number
  totalCost: number
}

interface CcusageDay {
  date: string
  inputTokens: number
  outputTokens: number
  cacheCreationTokens?: number
  cacheReadTokens?: number
  totalTokens: number
  totalCost: number
  modelsUsed: string[]
  modelBreakdowns: CcusageModelBreakdown[]
}

interface CcusageResponse {
  daily: CcusageDay[]
}

export async function submitCommand(options: { date?: string; all?: boolean }) {
  console.log(chalk.bold('\n📊 Submit Claude Code Usage\n'))

  // Validate options
  if (options.all && options.date) {
    console.error(chalk.red('Error: Cannot use --all and --date together'))
    process.exit(1)
  }

  const spinner = ora('Reading Claude Code usage data...').start()

  try {
    // Run ccusage to get data
    const { stdout, stderr } = await execAsync('npx ccusage@latest daily --json')
    const usageData: CcusageResponse = JSON.parse(stdout)

    if (options.all) {
      // Bulk import mode
      spinner.succeed(`Found ${usageData.daily.length} days of usage data`)

      console.log(chalk.cyan('\n🔄 Importing all historical data...\n'))

      let successful = 0
      let failed = 0
      let updated = 0
      let created = 0

      for (const dayData of usageData.daily) {
        const daySpinner = ora(`Submitting ${dayData.date}...`).start()

        try {
          // Build model breakdown
          const modelBreakdown: Record<string, number> = {}
          for (const breakdown of dayData.modelBreakdowns) {
            modelBreakdown[breakdown.modelName] = breakdown.totalCost
          }

          // Submit to API
          const result = await submitUsage({
            date: dayData.date,
            dailyCost: dayData.totalCost,
            modelBreakdown,
            inputTokens: dayData.inputTokens,
            outputTokens: dayData.outputTokens,
          })

          if (result.updated) {
            updated++
          } else {
            created++
          }
          successful++
          daySpinner.succeed(`${dayData.date}: $${dayData.totalCost.toFixed(2)}`)
        } catch (error) {
          failed++
          daySpinner.fail(`${dayData.date}: ${(error as Error).message}`)
        }
      }

      // Update last submission time
      setConfig('lastSubmission', new Date().toISOString())

      console.log(chalk.green('\n✓ Import complete!'))
      console.log(chalk.gray('\nSummary:'))
      console.log(chalk.white(`  Total days: ${usageData.daily.length}`))
      console.log(chalk.green(`  Successful: ${successful}`))
      console.log(chalk.yellow(`  Updated: ${updated}`))
      console.log(chalk.cyan(`  Created: ${created}`))
      if (failed > 0) {
        console.log(chalk.red(`  Failed: ${failed}`))
      }
      console.log()
    } else {
      // Single day mode
      const targetDate = options.date || new Date().toISOString().split('T')[0]

      // Find data for target date
      const dayData = usageData.daily.find((d) => d.date === targetDate)

      if (!dayData) {
        spinner.fail(`No usage data found for ${targetDate}`)
        console.log(chalk.yellow('\nTip: Make sure you have Claude Code usage for this date'))
        process.exit(1)
      }

      spinner.text = 'Calculating costs and tokens...'

      // Build model breakdown from the modelBreakdowns array
      const modelBreakdown: Record<string, number> = {}
      for (const breakdown of dayData.modelBreakdowns) {
        modelBreakdown[breakdown.modelName] = breakdown.totalCost
      }

      spinner.text = 'Submitting to leaderboard...'

      // Submit to API
      const result = await submitUsage({
        date: targetDate,
        dailyCost: dayData.totalCost,
        modelBreakdown,
        inputTokens: dayData.inputTokens,
        outputTokens: dayData.outputTokens,
      })

      spinner.succeed(result.updated ? 'Updated existing submission' : 'Submitted new data')

      // Update last submission time
      setConfig('lastSubmission', new Date().toISOString())

      console.log(chalk.green('\n✓ Successfully submitted!'))
      console.log(chalk.gray('\nSubmission details:'))
      console.log(chalk.white(`  Date: ${targetDate}`))
      console.log(chalk.white(`  Cost: $${dayData.totalCost.toFixed(2)}`))
      console.log(chalk.white(`  Input tokens: ${dayData.inputTokens.toLocaleString()}`))
      console.log(chalk.white(`  Output tokens: ${dayData.outputTokens.toLocaleString()}`))
      console.log()
    }
  } catch (error) {
    spinner.fail('Submission failed')

    const errorMessage = (error as Error).message

    // Check for ccusage "Invalid string length" error (large session file issue)
    if (errorMessage.includes('Invalid string length') || errorMessage.includes('RangeError')) {
      console.log(chalk.red('\n❌ Claude Code session file is too large for ccusage to process'))
      console.log(
        chalk.yellow(
          '\nThis is a known issue when Claude Code sessions contain large amounts of data.'
        )
      )
      console.log(chalk.white('\n🔧 How to fix this:\n'))
      console.log(chalk.cyan('1. Close your current Claude Code session'))
      console.log(chalk.cyan('2. Archive the large session file:'))
      console.log(chalk.gray('   mkdir -p ~/claude-session-backups'))
      console.log(
        chalk.gray('   mv ~/.claude/projects/*/[large-file].jsonl ~/claude-session-backups/')
      )
      console.log(chalk.cyan('3. Start a fresh Claude Code session'))
      console.log(chalk.cyan('4. Try submitting again'))
      console.log(chalk.white('\n💡 Tips to avoid this:'))
      console.log(chalk.gray('   • Close/restart Claude Code sessions periodically'))
      console.log(chalk.gray('   • Avoid running dev servers in background within Claude Code'))
      console.log(chalk.gray('   • Submit usage data regularly (before sessions get too large)'))
      console.log(
        chalk.white('\n📖 More info: ') +
          chalk.blue('https://github.com/ryoppippi/ccusage/issues/460')
      )
      console.log()
    } else {
      console.error(chalk.red('\n' + errorMessage))
    }

    process.exit(1)
  }
}
