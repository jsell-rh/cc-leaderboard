export default defineEventHandler(async (event) => {
  // Import dependencies first
  const db = getDatabase()
  const { users } = await import('../database/schema')
  const { eq } = await import('drizzle-orm')

  // Support both API key (CLI) and session (web) authentication
  let user
  const authHeader = getHeader(event, 'Authorization')

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // CLI authentication via API key
    user = await requireApiKey(event)
  } else {
    // Web authentication via session
    user = await requireAuth(event)
  }

  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    avatar: dbUser.avatar,
    apiKey: dbUser.apiKey,
    createdAt: dbUser.createdAt,
  }
})
