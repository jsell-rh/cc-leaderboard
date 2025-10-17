export default defineOAuthGitHubEventHandler({
  config: {
    redirectURL: process.env.NUXT_PUBLIC_APP_URL
      ? `${process.env.NUXT_PUBLIC_APP_URL}/api/auth/github`
      : undefined,
    scope: ['user:email'],
  },
  async onSuccess(event, { user, tokens }) {
    const config = useRuntimeConfig()

    // Fetch user's primary verified email
    const emails = await $fetch<
      Array<{
        email: string
        primary: boolean
        verified: boolean
      }>
    >('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const primaryEmail = emails.find((e) => e.primary && e.verified)

    if (!primaryEmail) {
      throw createError({
        statusCode: 403,
        message: 'No verified primary email found on your GitHub account',
      })
    }

    // Check if email matches required domain
    const requiredDomain = config.public.requiredEmailDomain
    if (requiredDomain && !primaryEmail.email.endsWith(requiredDomain)) {
      throw createError({
        statusCode: 403,
        message: `Email must be from ${requiredDomain} domain`,
      })
    }

    // Get or create user in database
    const db = getDatabase()
    const { users } = await import('../../database/schema')
    const { eq } = await import('drizzle-orm')

    let dbUser = await db.query.users.findFirst({
      where: eq(users.githubId, user.id.toString()),
    })

    if (!dbUser) {
      // Generate API key
      const apiKey = await generateApiKey(user.id.toString())

      const [newUser] = await db
        .insert(users)
        .values({
          githubId: user.id.toString(),
          email: primaryEmail.email,
          name: user.name || user.login,
          avatar: user.avatar_url,
          apiKey,
        })
        .returning()

      dbUser = newUser
    } else {
      // Update last seen
      await db.update(users).set({ lastSeenAt: new Date() }).where(eq(users.id, dbUser.id))
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: dbUser.id,
        githubId: dbUser.githubId,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar,
      },
    })

    // Redirect to settings if coming from CLI, otherwise to home
    const query = getQuery(event)
    const redirectPath = query.source === 'cli' ? '/settings?from=cli' : '/'

    return sendRedirect(event, redirectPath)
  },

  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?error=auth_failed')
  },
})

async function generateApiKey(userId: string): Promise<string> {
  const config = useRuntimeConfig()
  const crypto = await import('crypto')

  // Create JWT token as API key
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')

  const hmac = crypto.createHmac('sha256', config.jwtSecret)
  hmac.update(`${header}.${body}`)
  const signature = hmac.digest('base64url')

  return `${header}.${body}.${signature}`
}
