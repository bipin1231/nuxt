export default defineEventHandler((event) => {
     if (!event.path.startsWith('/admin')) {
    return
  }
  const token = getCookie(event, 'user')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You are not logged in.'
    })
  }
  const user = JSON.parse(token)

  if (user.role!=="admin") {
    throw createError({
      statusCode: 401,
      statusMessage: 'You are Unauthorized'
    })
  }
 
  

 

})
