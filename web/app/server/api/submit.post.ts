import { z } from 'zod'

const submissionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dailyCost: z.number().positive(),
  modelBreakdown: z.record(z.number()),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative()
})

export default defineEventHandler(async (event) => {
  // Verify API key
  const user = await requireApiKey(event)

  // Parse and validate request body
  const body = await readBody(event)

  const validation = submissionSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid submission data',
      data: validation.error.errors
    })
  }

  const data = validation.data

  // Check rate limit
  await checkRateLimit(event, `user:${user.id}`, 'submit', 100, 3600) // 100 per hour

  // Insert or update submission
  const db = getDatabase()
  const { submissions } = await import('../database/schema')
  const { eq, and } = await import('drizzle-orm')

  // Check if submission already exists for this date
  const existing = await db.query.submissions.findFirst({
    where: and(
      eq(submissions.userId, user.id),
      eq(submissions.date, data.date)
    )
  })

  if (existing) {
    // Update existing submission
    await db.update(submissions)
      .set({
        dailyCost: data.dailyCost,
        modelBreakdown: data.modelBreakdown,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens
      })
      .where(eq(submissions.id, existing.id))

    return { success: true, updated: true }
  } else {
    // Insert new submission
    await db.insert(submissions).values({
      userId: user.id,
      date: data.date,
      dailyCost: data.dailyCost,
      modelBreakdown: data.modelBreakdown,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens
    })

    return { success: true, updated: false }
  }
})
