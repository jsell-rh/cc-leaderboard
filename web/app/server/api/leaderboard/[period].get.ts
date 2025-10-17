import { z } from 'zod'
import { sql, desc, and, gte, lte } from 'drizzle-orm'

const periodSchema = z.enum(['daily', 'weekly', 'monthly', 'all-time'])

export default defineEventHandler(async (event) => {
  const period = getRouterParam(event, 'period')

  const validation = periodSchema.safeParse(period)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid period. Must be one of: daily, weekly, monthly, all-time',
    })
  }

  const db = getDatabase()
  const { submissions, users } = await import('../../database/schema')

  let dateFilter
  const now = new Date()

  switch (validation.data) {
    case 'daily':
      // Today's submissions
      const today = now.toISOString().split('T')[0]
      dateFilter = and(gte(submissions.date, today), lte(submissions.date, today))
      break

    case 'weekly':
      // Last 7 days
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateFilter = gte(submissions.date, weekAgo.toISOString().split('T')[0])
      break

    case 'monthly':
      // Last 30 days
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      dateFilter = gte(submissions.date, monthAgo.toISOString().split('T')[0])
      break

    case 'all-time':
      // No filter
      dateFilter = undefined
      break
  }

  // Aggregate submissions by user (only show users with submissions in this period)
  let query = db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
      totalCost: sql<number>`SUM(${submissions.dailyCost})`.as('total_cost'),
      totalInputTokens: sql<number>`SUM(${submissions.inputTokens})`.as('total_input_tokens'),
      totalOutputTokens: sql<number>`SUM(${submissions.outputTokens})`.as('total_output_tokens'),
      submissionCount: sql<number>`COUNT(${submissions.id})`.as('submission_count'),
    })
    .from(submissions)
    .innerJoin(users, sql`${users.id} = ${submissions.userId}`)

  if (dateFilter) {
    query = query.where(dateFilter) as typeof query
  }

  const results = await query
    .groupBy(users.id, users.name, users.email, users.avatar)
    .orderBy(desc(sql`total_cost`))

  return {
    period: validation.data,
    leaderboard: results.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      name: row.name,
      avatar: row.avatar,
      totalCost: row.totalCost,
      totalInputTokens: row.totalInputTokens,
      totalOutputTokens: row.totalOutputTokens,
      submissionCount: row.submissionCount,
    })),
  }
})
