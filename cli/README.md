# cc-leaderboard

CLI tool to submit your Claude Code usage to your team's leaderboard.

## Configuration

**First time setup:** Your team likely has a dedicated leaderboard instance. Configure the CLI to point to your team's server:

```bash
npx cc-leaderboard config --api-url https://your-team-leaderboard.com
```

> **Don't know your team's URL?** Ask your team lead or check your team's documentation.
>
> If you run `npx cc-leaderboard login` without configuring first, the CLI will prompt you to enter your team's URL.

## Quick Start

No installation required! Just use `npx`:

```bash
# Configure your team's leaderboard URL (first time only)
npx cc-leaderboard config --api-url https://your-team-leaderboard.com

# Authenticate with GitHub
npx cc-leaderboard login

# Submit today's usage
npx cc-leaderboard submit

# Import all historical usage data
npx cc-leaderboard submit --all

# Submit a specific date
npx cc-leaderboard submit --date 2024-01-15

# Check your configuration
npx cc-leaderboard status
```

## Commands

### `login`

Authenticate with the leaderboard via GitHub OAuth.

```bash
npx cc-leaderboard login
```

This will:

1. Open your browser for GitHub authentication
2. Generate an API key for your account
3. Securely store the key in your system keychain

### `submit`

Submit your Claude Code usage data to the leaderboard.

```bash
# Submit today's usage
npx cc-leaderboard submit

# Submit a specific date
npx cc-leaderboard submit --date 2024-01-15

# Import all historical usage data
npx cc-leaderboard submit --all
```

**Options:**

- `--date <YYYY-MM-DD>` - Submit data for a specific date (defaults to today)
- `--all` - Import all historical usage data from Claude Code

The `--all` flag is perfect for when you first join the leaderboard and want to import your complete history.

### `config`

Configure your team's leaderboard URL and auto-submit settings.

```bash
# Set your team's leaderboard URL (required for first-time setup)
npx cc-leaderboard config --api-url https://your-team-leaderboard.com

# Configure auto-submit
npx cc-leaderboard config --auto-submit daily
npx cc-leaderboard config --auto-submit weekly
npx cc-leaderboard config --auto-submit off
```

**Options:**

- `--api-url <url>` - Set the URL for your team's leaderboard server
- `--auto-submit <schedule>` - Enable automatic daily/weekly submissions

### `status`

View your current configuration and recent submissions.

```bash
npx cc-leaderboard status
```

## How It Works

The CLI tool uses the [`ccusage`](https://www.npmjs.com/package/ccusage) package to read your Claude Code usage data from your local machine, then submits it to the leaderboard server.

**Privacy:** Your usage data never leaves your machine except when you explicitly run the `submit` command.

## Requirements

- Node.js 18 or higher
- Claude Code installed and configured
- GitHub account (for authentication)

## Auto-Submit Setup

You can set up a cron job to automatically submit your usage:

### macOS/Linux

```bash
# Open crontab editor
crontab -e

# Add this line to submit daily at 6 PM
0 18 * * * npx cc-leaderboard submit
```

### Windows (Task Scheduler)

Create a task that runs:

```powershell
npx cc-leaderboard submit
```

## Support

- **Documentation:** https://github.com/jsell-rh/cc-leaderboard
- **Issues:** https://github.com/jsell-rh/cc-leaderboard/issues

## License

MIT
