export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useAuth()

  if (!user.value) {
    await fetchUser()
  }
     if (!user.value) return navigateTo('/')
  
   const role = user.value?.role 
  const allowedRoles = ['admin', 'editor','viewer']
  
    if (!allowedRoles.includes(role)) {
    return navigateTo('/')
  }

})
