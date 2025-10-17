# Contributing Guide

Thank you for contributing to the Claude Code Leaderboard!

## Development Setup

### Prerequisites

- Node.js 18 or later
- npm or pnpm
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/jsell-rh/cc-leaderboard.git
cd cc-leaderboard

# Install dependencies
npm install

# Set up environment variables
cp web/.env.example web/.env
```

### GitHub OAuth Setup (for local development)

1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set callback URL to: `http://localhost:3000/api/auth/github`
4. Add credentials to `web/.env`:

```env
NUXT_OAUTH_GITHUB_CLIENT_ID=your_client_id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your_client_secret
NUXT_JWT_SECRET=any-random-secret-for-dev
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Locally

```bash
# Start web app (development mode with hot reload)
npm run dev:web

# In another terminal, start CLI in watch mode
npm run dev:cli

# Test CLI locally
cd cli && npm link
ccleaderboard --help
```

## Project Structure

```
cc-leaderboard/
├── cli/                      # CLI tool
│   ├── src/
│   │   ├── commands/        # Command implementations
│   │   ├── api-client.ts    # API client
│   │   ├── config.ts        # Configuration management
│   │   └── index.ts         # Entry point
│   └── package.json
├── web/                     # Web application
│   ├── app/
│   │   ├── components/     # Vue components
│   │   ├── layouts/        # Layout components
│   │   ├── middleware/     # Route middleware
│   │   ├── pages/          # Page components
│   │   └── server/         # Server-side code
│   │       ├── api/        # API routes
│   │       ├── database/   # Database schema & client
│   │       ├── routes/     # OAuth routes
│   │       └── utils/      # Server utilities
│   ├── nuxt.config.ts      # Nuxt configuration
│   └── package.json
└── deployment/             # Kubernetes manifests
```

## Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

## Testing

```bash
# Run all tests
npm test

# Run web tests
npm test --workspace=web

# Run CLI tests
npm test --workspace=cli

# Run with coverage
npm test -- --coverage
```

## Git Workflow

### Branching

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commits

We use conventional commits:

```
feat: add auto-submit scheduling
fix: resolve database connection issue
docs: update deployment guide
chore: update dependencies
test: add API endpoint tests
```

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Update documentation if needed
5. Run linting and tests locally
6. Push and create a PR
7. Wait for CI checks to pass
8. Request review

## Adding New Features

### Adding a New CLI Command

1. Create command file in `cli/src/commands/`
2. Implement the command logic
3. Export the command function
4. Add command to `cli/src/index.ts`
5. Add tests
6. Update CLI documentation

Example:

```typescript
// cli/src/commands/mycommand.ts
import chalk from 'chalk'

export async function myCommand(options: any) {
  console.log(chalk.green('Hello from my command!'))
}

// cli/src/index.ts
import { myCommand } from './commands/mycommand.js'

program
  .command('mycommand')
  .description('Description of my command')
  .action(myCommand)
```

### Adding a New API Endpoint

1. Create route file in `web/app/server/api/`
2. Implement the endpoint handler
3. Add validation with Zod
4. Add authentication if needed
5. Add tests
6. Update API documentation

Example:

```typescript
// web/app/server/api/myendpoint.get.ts
import { z } from 'zod'

const querySchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  // Your logic here

  return { data: 'response' }
})
```

### Adding a New Page

1. Create page file in `web/app/pages/`
2. Implement the Vue component
3. Add to navigation if needed
4. Update middleware if authentication required

Example:

```vue
<!-- web/app/pages/mypage.vue -->
<template>
  <div>
    <h1>My Page</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth' // If authentication required
})
</script>
```

## Database Migrations

We use Drizzle ORM. To create a migration:

```bash
cd web
npx drizzle-kit generate:sqlite --schema=app/server/database/schema.ts
```

## Security

### Reporting Security Issues

Please report security vulnerabilities to [security contact]. Do not create public issues for security problems.

### Security Checklist

- [ ] Input validation on all endpoints
- [ ] Authentication required for sensitive operations
- [ ] Rate limiting on public endpoints
- [ ] SQL injection protection (use ORM)
- [ ] XSS prevention (Vue escapes by default)
- [ ] CSRF protection (handled by Nuxt)
- [ ] Secure headers (HTTPS, CSP, etc.)

## Performance

### Best Practices

- Use database indexes for frequently queried fields
- Implement caching where appropriate
- Minimize API calls in CLI
- Use lazy loading for components
- Optimize images and assets

## Documentation

When adding features, please update:

- README.md (if user-facing)
- DEPLOYMENT.md (if deployment-related)
- API documentation (for new endpoints)
- Code comments (for complex logic)

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Build and push Docker image
6. Create GitHub release with notes

## Getting Help

- Check existing issues
- Read the documentation
- Ask in discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
