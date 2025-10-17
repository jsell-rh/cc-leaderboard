import type { H3Event } from 'h3'

/**
 * Simple rate limiting using database
 * @param event H3 event
 * @param identifier User ID or IP address
 * @param endpoint Endpoint name
 * @param limit Maximum requests per window
 * @param windowSeconds Window duration in seconds
 */
export async function checkRateLimit(
  event: H3Event,
  identifier: string,
  endpoint: string,
  limit: number,
  windowSeconds: number
) {
  const db = getDatabase()
  const { rateLimits } = await import('../database/schema')
  const { eq, and } = await import('drizzle-orm')

  const now = new Date()
  const windowStart = new Date(now.getTime() - windowSeconds * 1000)

  // Find existing rate limit record
  const existing = await db.query.rateLimits.findFirst({
    where: and(
      eq(rateLimits.identifier, identifier),
      eq(rateLimits.endpoint, endpoint)
    )
  })

  if (existing) {
    // Check if window has expired
    if (existing.windowStart < windowStart) {
      // Reset window
      await db.update(rateLimits)
        .set({
          count: 1,
          windowStart: now
        })
        .where(eq(rateLimits.id, existing.id))
    } else {
      // Increment count
      if (existing.count >= limit) {
        throw createError({
          statusCode: 429,
          message: 'Rate limit exceeded. Please try again later.'
        })
      }

      await db.update(rateLimits)
        .set({
          count: existing.count + 1
        })
        .where(eq(rateLimits.id, existing.id))
    }
  } else {
    // Create new rate limit record
    await db.insert(rateLimits).values({
      identifier,
      endpoint,
      count: 1,
      windowStart: now
    })
  }
}
