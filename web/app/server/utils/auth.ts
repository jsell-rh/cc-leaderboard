import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  return session.user
}

export async function verifyApiKey(apiKey: string) {
  const config = useRuntimeConfig()
  const crypto = await import('crypto')

  try {
    const parts = apiKey.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [header, body, signature] = parts

    // Verify signature
    const hmac = crypto.createHmac('sha256', config.jwtSecret)
    hmac.update(`${header}.${body}`)
    const expectedSignature = hmac.digest('base64url')

    if (signature !== expectedSignature) {
      return null
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())

    // Get user from database
    const db = getDatabase()
    const { users } = await import('../database/schema')
    const { eq } = await import('drizzle-orm')

    const user = await db.query.users.findFirst({
      where: eq(users.apiKey, apiKey)
    })

    return user
  } catch (error) {
    console.error('Error verifying API key:', error)
    return null
  }
}

export async function requireApiKey(event: H3Event) {
  const authHeader = getHeader(event, 'Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'API key required'
    })
  }

  const apiKey = authHeader.substring(7)
  const user = await verifyApiKey(apiKey)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid API key'
    })
  }

  return user
}
