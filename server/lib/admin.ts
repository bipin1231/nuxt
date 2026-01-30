
export const requireAdmin = defineEventHandler((event) => {

  if(event.context.user.role !== 'admin') throw createError({ statusCode: 403 })
})
