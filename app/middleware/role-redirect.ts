export default defineNuxtRouteMiddleware(async (to) => {
//   const user = useState<any>('user')
  const { user,fetchUser } = useAuth()

  if (!user.value) {
    await fetchUser()
  }
   if (!user.value) return

  if (to.path.startsWith('/admin')) return
  
   const role = user.value?.role 
  const allowedRoles = ['admin', 'editor','viewer']

   if (allowedRoles.includes(role)) {
    return navigateTo('/admin')
  }
})
