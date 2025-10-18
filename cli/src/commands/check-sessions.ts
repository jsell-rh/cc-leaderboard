import chalk from 'chalk'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export async function checkSessionsCommand() {
  console.log(chalk.bold('\n🔍 Checking Claude Code Session Files\n'))

  try {
    const projectsDir = join(homedir(), '.claude', 'projects')
    const projects = readdirSync(projectsDir)

    let largeSessionsFound = 0
    const warnings: string[] = []

    for (const project of projects) {
      const projectPath = join(projectsDir, project)
      try {
        const files = readdirSync(projectPath)

        for (const file of files) {
          if (file.endsWith('.jsonl')) {
            const filePath = join(projectPath, file)
            const stats = statSync(filePath)
            const sizeMB = stats.size / (1024 * 1024)

            if (sizeMB > 100) {
              largeSessionsFound++
              warnings.push(
                chalk.yellow('⚠') + ' ' + file + ': ' + chalk.red(sizeMB.toFixed(1) + ' MB')
              )

              if (sizeMB > 500) {
                warnings.push(
                  chalk.gray(
                    '   This file is likely too large for ccusage to process (exceeds 500MB)'
                  )
                )
              }
            }
          }
        }
      } catch (error) {
        // Skip projects we can't read
      }
    }

    if (largeSessionsFound > 0) {
      console.log(chalk.yellow('Found ' + largeSessionsFound + ' large session file(s):\n'))
      warnings.forEach((w) => console.log(w))

      console.log(chalk.white('\n🔧 Recommended actions:\n'))
      console.log(chalk.cyan('1. Close your current Claude Code session'))
      console.log(chalk.cyan('2. Archive large session files:'))
      console.log(chalk.gray('   mkdir -p ~/claude-session-backups'))
      console.log(
        chalk.gray('   mv ~/.claude/projects/*/[large-file].jsonl ~/claude-session-backups/')
      )
      console.log(chalk.cyan('3. Start a fresh Claude Code session'))
      console.log(chalk.white('\n💡 Best practices:'))
      console.log(chalk.gray('   • Restart Claude Code sessions regularly (weekly recommended)'))
      console.log(chalk.gray('   • Submit usage data frequently (before sessions grow large)'))
      console.log(chalk.gray('   • Avoid running background dev servers in Claude Code'))
      console.log(
        chalk.white('\n📖 More info: ') +
          chalk.blue('https://github.com/ryoppippi/ccusage/issues/460')
      )
      console.log()
    } else {
      console.log(chalk.green('✓ No large session files detected'))
      console.log(
        chalk.gray(
          '\nAll session files are under 100MB. You should be able to submit without issues.\n'
        )
      )
    }
  } catch (error) {
    console.error(chalk.red('Error checking session files:'), (error as Error).message)
    process.exit(1)
  }
}
