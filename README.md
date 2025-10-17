# Claude Code Usage Leaderboard

A beautiful, secure web application and CLI tool for tracking and comparing Claude Code usage across your team.

## Features

- **GitHub OAuth Authentication** with email domain verification
- **Beautiful Web Dashboard** with real-time leaderboard updates
- **Multiple Time Periods**: Daily, Weekly, Monthly, and All-Time views
- **Simple CLI Tool** for easy usage submission
- **Secure API Key Management** with encrypted storage
- **Auto-Submit Capability** for hands-free tracking
- **Rate Limiting** and security best practices
- **OpenShift/Kubernetes Ready** with easy deployment

## Quick Start

### For Users

#### 1. Install the CLI

```bash
npx ccleaderboard login
```

This will open your browser for GitHub authentication.

#### 2. Submit Your Usage

```bash
npx ccleaderboard submit
```

The CLI automatically reads your Claude Code usage data and submits it to the leaderboard.

#### 3. (Optional) Enable Auto-Submit

```bash
npx ccleaderboard config --auto-submit daily
```

Then set up a cron job:

```bash
# Submit every day at 6 PM
0 18 * * * npx ccleaderboard submit
```

### For Administrators

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Architecture

```
cc-leaderboard/
├── cli/                    # CLI tool (TypeScript)
│   ├── src/
│   │   ├── commands/      # login, submit, config, status
│   │   ├── api-client.ts
│   │   └── config.ts
│   └── package.json
├── web/                   # Nuxt 4 web app
│   ├── app/
│   │   ├── components/   # Vue components
│   │   ├── pages/        # Leaderboard, settings
│   │   └── server/       # API routes, database
│   ├── nuxt.config.ts
│   └── package.json
└── deployment/           # Kubernetes manifests
```

## Tech Stack

### Web App
- **Nuxt 4** - Vue framework with SSR
- **Vue 3** - UI framework
- **@nuxt/ui** - Beautiful UI components
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **SQLite** - Lightweight database
- **GitHub OAuth** - Authentication

### CLI
- **Commander.js** - CLI framework
- **Chalk** - Colored terminal output
- **Ora** - Loading spinners
- **Keytar** - Secure credential storage

## API Endpoints

### Authentication
- `GET /api/auth/github` - GitHub OAuth flow

### User
- `GET /api/me` - Get current user info

### Submissions
- `POST /api/submit` - Submit usage data

### Leaderboard
- `GET /api/leaderboard/:period` - Get leaderboard (daily, weekly, monthly, all-time)

## Security Features

- **GitHub OAuth** with email domain verification
- **JWT-based API keys** for CLI authentication
- **Rate limiting** on all API endpoints
- **Input validation** with Zod schemas
- **HTTPS-only** in production
- **Secure credential storage** with OS keychain
- **SQL injection protection** with Drizzle ORM

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp web/.env.example web/.env
# Edit web/.env with your GitHub OAuth credentials

# Start development server
npm run dev:web

# In another terminal, run CLI in dev mode
npm run dev:cli
```

### Building

```bash
# Build web app
npm run build:web

# Build CLI
npm run build:cli

# Build both
npm run build
```

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Support

For issues and feature requests, please open an issue on GitHub.
