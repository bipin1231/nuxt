export default defineNuxtRouteMiddleware(async () => {
//   const user = useState<any>('user')
  const { user,fetchUser } = useAuth()

  // if (!user.value) {
  //   await fetchUser()
  // }
  // console.log("middleware user",user);
  

  // if (user.value?.role === 'admin') {
  //   return navigateTo('/admin')
  // }
})
