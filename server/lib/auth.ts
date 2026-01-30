import jwt from 'jsonwebtoken'
export const requireAuth = defineEventHandler((event) => {
  const token = getCookie(event, 'token')
  if (!token) throw createError({ statusCode: 401 })

  const payload = jwt.verify(token, process.env.JWT_SECRET!)
  console.log("payload",payload);
  
  event.context.user = payload
})
