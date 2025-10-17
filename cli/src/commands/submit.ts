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

export async function submitCommand(options: { date?: string }) {
  console.log(chalk.bold('\n📊 Submit Claude Code Usage\n'))

  const spinner = ora('Reading Claude Code usage data...').start()

  try {
    // Determine date
    const targetDate = options.date || new Date().toISOString().split('T')[0]

    // Run ccusage to get data
    const { stdout } = await execAsync('npx ccusage@latest daily --json')
    const usageData: CcusageResponse = JSON.parse(stdout)

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
  } catch (error) {
    spinner.fail('Submission failed')
    console.error(chalk.red('\n' + (error as Error).message))
    process.exit(1)
  }
}
