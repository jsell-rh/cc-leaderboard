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

#### Setting up GitHub OAuth

1. **Create a GitHub OAuth App**

   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in the details:
     - **Application name**: `Claude Code Leaderboard` (or your preferred name)
     - **Homepage URL**:
       - Development: `http://localhost:3000`
       - Production: `https://your-domain.com`
     - **Authorization callback URL**:
       - Development: `http://localhost:3000/api/auth/github`
       - Production: `https://your-domain.com/api/auth/github`
   - Click "Register application"
   - Copy the **Client ID** and generate a **Client Secret**

2. **Configure Environment Variables**

```bash
cd web
cp .env.example .env
```

Edit `.env` and add your GitHub OAuth credentials:

```bash
# GitHub OAuth Configuration
NUXT_OAUTH_GITHUB_CLIENT_ID=your_github_client_id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT Secret for API key generation (change this to a random string)
NUXT_JWT_SECRET=your-secret-key-change-in-production

# Public Configuration
NUXT_PUBLIC_APP_URL=http://localhost:3000
# Optional: Restrict to specific email domain (e.g., @company.com)
# Leave empty to allow all GitHub users
NUXT_PUBLIC_REQUIRED_EMAIL_DOMAIN=@example.com

# Database path (optional)
DATABASE_PATH=./data/leaderboard.db
```

3. **Start the Application**

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

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
- **ShadCN Vue** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **SQLite** - Lightweight database
- **Pino** - Fast structured logging
- **GitHub OAuth** - Authentication via nuxt-auth-utils

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

## Publishing the CLI to npm

The CLI package is automatically published to npm when you push a version tag.

### Setting up npm Publishing

1. **Create an npm access token**

   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token

2. **Add the token to GitHub Secrets**
   - Go to your repository settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

### Publishing a new version

1. Update the version in `cli/package.json`:

   ```bash
   cd cli
   npm version patch  # or minor, or major
   ```

2. Commit the version change:

   ```bash
   git add package.json
   git commit -m "chore: bump version to X.Y.Z"
   ```

3. Create and push a git tag:

   ```bash
   git tag v0.1.1  # Match the version in package.json
   git push origin main --tags
   ```

4. The GitHub Action will automatically:
   - Build the TypeScript CLI
   - Publish to npm
   - Users can then use `npx ccleaderboard` without installing anything

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Support

For issues and feature requests, please open an issue on GitHub.
