
export const hasEditAccess = defineEventHandler((event) => {
  
 const role = event.context.user?.role
  const allowedRoles = ['admin', 'editor']

    if (!allowedRoles.includes(role)) {
    throw createError({ statusCode: 403,statusMessage:"You dont have access to this."})
  }
})
