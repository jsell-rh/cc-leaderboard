export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const db = getDatabase()
  const { users } = await import('../database/schema')
  const { eq } = await import('drizzle-orm')

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    avatar: dbUser.avatar,
    apiKey: dbUser.apiKey,
    createdAt: dbUser.createdAt
  }
})
