export default defineEventHandler((event) => {
  const user = getCookie(event, 'user')

  return {
    user: user || null
  }
})
