import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)


    event.context.user = decoded

    return {
      success: true,
      user: decoded,
    }
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token',
    })
  }
})
