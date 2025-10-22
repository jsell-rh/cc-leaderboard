import { eq } from 'drizzle-orm'
import { users } from '../database/schema'

export default defineEventHandler(async (event) => {
  // Require authentication
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }

  const db = getDatabase()

  // Find the user by database ID
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  // Import generateApiKey function
  const crypto = await import('crypto')
  const config = useRuntimeConfig()

  // Generate new API key (same logic as in github.ts)
  const payload = {
    sub: dbUser.id.toString(),
    iat: Math.floor(Date.now() / 1000),
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')

  const hmac = crypto.createHmac('sha256', config.jwtSecret)
  hmac.update(`${header}.${body}`)
  const signature = hmac.digest('base64url')

  const newApiKey = `${header}.${body}.${signature}`

  // Update the user's API key
  await db.update(users).set({ apiKey: newApiKey }).where(eq(users.id, dbUser.id))

  return {
    apiKey: newApiKey,
  }
})
