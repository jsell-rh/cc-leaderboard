import chalk from 'chalk'
import ora from 'ora'
import { exec } from 'child_process'
import { promisify } from 'util'
import { submitUsage } from '../api-client.js'
import { setConfig } from '../config.js'

const execAsync = promisify(exec)

interface CcusageDay {
  date: string
  costUSD: number
  models: Record<string, {
    costUSD: number
    inputTokens: number
    outputTokens: number
  }>
}

export async function submitCommand(options: { date?: string }) {
  console.log(chalk.bold('\n📊 Submit Claude Code Usage\n'))

  const spinner = ora('Reading Claude Code usage data...').start()

  try {
    // Determine date
    const targetDate = options.date || new Date().toISOString().split('T')[0]

    // Run ccusage to get data
    const { stdout } = await execAsync('npx ccusage@latest daily --json')
    const usageData: CcusageDay[] = JSON.parse(stdout)

    // Find data for target date
    const dayData = usageData.find(d => d.date === targetDate)

    if (!dayData) {
      spinner.fail(`No usage data found for ${targetDate}`)
      console.log(chalk.yellow('\nTip: Make sure you have Claude Code usage for this date'))
      process.exit(1)
    }

    spinner.text = 'Calculating costs and tokens...'

    // Calculate totals
    let totalInputTokens = 0
    let totalOutputTokens = 0
    const modelBreakdown: Record<string, number> = {}

    for (const [model, data] of Object.entries(dayData.models)) {
      totalInputTokens += data.inputTokens
      totalOutputTokens += data.outputTokens
      modelBreakdown[model] = data.costUSD
    }

    spinner.text = 'Submitting to leaderboard...'

    // Submit to API
    const result = await submitUsage({
      date: targetDate,
      dailyCost: dayData.costUSD,
      modelBreakdown,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens
    })

    spinner.succeed(result.updated ? 'Updated existing submission' : 'Submitted new data')

    // Update last submission time
    setConfig('lastSubmission', new Date().toISOString())

    console.log(chalk.green('\n✓ Successfully submitted!'))
    console.log(chalk.gray('\nSubmission details:'))
    console.log(chalk.white(`  Date: ${targetDate}`))
    console.log(chalk.white(`  Cost: $${dayData.costUSD.toFixed(2)}`))
    console.log(chalk.white(`  Input tokens: ${totalInputTokens.toLocaleString()}`))
    console.log(chalk.white(`  Output tokens: ${totalOutputTokens.toLocaleString()}`))
    console.log()

  } catch (error) {
    spinner.fail('Submission failed')
    console.error(chalk.red('\n' + (error as Error).message))
    process.exit(1)
  }
}
