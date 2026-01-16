export default defineEventHandler((event) => {
 const cookie = getCookie(event, 'user')

  return {
    user: cookie ? JSON.parse(cookie) : null
  }
})
