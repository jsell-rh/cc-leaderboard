import { z } from 'zod'
import { sql, desc, and, gte, lte } from 'drizzle-orm'

const periodSchema = z.enum(['daily', 'weekly', 'monthly', 'all-time'])

export default defineEventHandler(async (event) => {
  // Require authentication - this will throw 401 if not logged in
  await requireUserSession(event)

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

  // Get all users who have at least one submission
  const usersWithSubmissions = await db
    .selectDistinct({ userId: submissions.userId })
    .from(submissions)

  const userIds = usersWithSubmissions.map((u) => u.userId)

  // Build subquery for period-specific submissions
  const periodSubmissionsSubquery = db.$with('period_submissions').as(
    db
      .select({
        userId: submissions.userId,
        dailyCost: submissions.dailyCost,
        inputTokens: submissions.inputTokens,
        outputTokens: submissions.outputTokens,
        id: submissions.id,
      })
      .from(submissions)
      .where(dateFilter || sql`1=1`)
  )

  // Build subquery for latest submission date (across all time)
  const latestSubmissionSubquery = db.$with('latest_submission').as(
    db
      .select({
        userId: submissions.userId,
        lastSubmissionDate: sql<string>`MAX(${submissions.date})`.as('last_submission_date'),
      })
      .from(submissions)
      .groupBy(submissions.userId)
  )

  // Main query: get all users with left join to period submissions and latest dates
  const results = await db
    .with(periodSubmissionsSubquery, latestSubmissionSubquery)
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
      totalCost: sql<number>`COALESCE(SUM(${periodSubmissionsSubquery.dailyCost}), 0)`.as(
        'total_cost'
      ),
      totalInputTokens: sql<number>`COALESCE(SUM(${periodSubmissionsSubquery.inputTokens}), 0)`.as(
        'total_input_tokens'
      ),
      totalOutputTokens:
        sql<number>`COALESCE(SUM(${periodSubmissionsSubquery.outputTokens}), 0)`.as(
          'total_output_tokens'
        ),
      submissionCount: sql<number>`COUNT(${periodSubmissionsSubquery.id})`.as('submission_count'),
      lastSubmissionDate: latestSubmissionSubquery.lastSubmissionDate,
    })
    .from(users)
    .leftJoin(periodSubmissionsSubquery, sql`${users.id} = ${periodSubmissionsSubquery.userId}`)
    .leftJoin(latestSubmissionSubquery, sql`${users.id} = ${latestSubmissionSubquery.userId}`)
    .where(sql`${users.id} IN ${userIds}`)
    .groupBy(
      users.id,
      users.name,
      users.email,
      users.avatar,
      latestSubmissionSubquery.lastSubmissionDate
    )
    .orderBy(desc(sql`total_cost`))

  // Fetch daily breakdown for each user (last 365 days, regardless of period selected)
  // This shows full activity overview in detailed view, while tabs control ranking order
  const dailyBreakdownMap = new Map<number, Array<{ date: string; cost: number }>>()

  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  const activityDataFilter = gte(submissions.date, oneYearAgo.toISOString().split('T')[0])

  const dailyData = await db
    .select({
      userId: submissions.userId,
      date: submissions.date,
      cost: submissions.dailyCost,
    })
    .from(submissions)
    .where(activityDataFilter)
    .orderBy(submissions.date)

  for (const row of dailyData) {
    if (!dailyBreakdownMap.has(row.userId)) {
      dailyBreakdownMap.set(row.userId, [])
    }
    dailyBreakdownMap.get(row.userId)!.push({ date: row.date, cost: row.cost })
  }

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
      lastSubmissionDate: row.lastSubmissionDate,
      dailyData: dailyBreakdownMap.get(row.userId) || [],
    })),
  }
})
