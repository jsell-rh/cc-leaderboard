# ccleaderboard

CLI tool to submit your Claude Code usage to the leaderboard.

## Quick Start

No installation required! Just use `npx`:

```bash
# Authenticate with GitHub
npx ccleaderboard login

# Submit today's usage
npx ccleaderboard submit

# Import all historical usage data
npx ccleaderboard submit --all

# Submit a specific date
npx ccleaderboard submit --date 2024-01-15

# Check your configuration
npx ccleaderboard status
```

## Commands

### `login`

Authenticate with the leaderboard via GitHub OAuth.

```bash
npx ccleaderboard login
```

This will:

1. Open your browser for GitHub authentication
2. Generate an API key for your account
3. Securely store the key in your system keychain

### `submit`

Submit your Claude Code usage data to the leaderboard.

```bash
# Submit today's usage
npx ccleaderboard submit

# Submit a specific date
npx ccleaderboard submit --date 2024-01-15

# Import all historical usage data
npx ccleaderboard submit --all
```

**Options:**

- `--date <YYYY-MM-DD>` - Submit data for a specific date (defaults to today)
- `--all` - Import all historical usage data from Claude Code

The `--all` flag is perfect for when you first join the leaderboard and want to import your complete history.

### `config`

Configure auto-submit settings.

```bash
npx ccleaderboard config --auto-submit daily
npx ccleaderboard config --auto-submit weekly
npx ccleaderboard config --auto-submit off
```

### `status`

View your current configuration and recent submissions.

```bash
npx ccleaderboard status
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
0 18 * * * npx ccleaderboard submit
```

### Windows (Task Scheduler)

Create a task that runs:

```powershell
npx ccleaderboard submit
```

## Support

- **Documentation:** https://github.com/jsell-rh/cc-leaderboard
- **Issues:** https://github.com/jsell-rh/cc-leaderboard/issues

## License

MIT
