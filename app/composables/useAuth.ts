  import { ref } from 'vue'
  import type { User } from '~/types/user'

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const loading = ref(true)

  // get user info from server
  const fetchUser = async () => {
    try {
      const res = await $fetch<{ user: User }>('/api/auth/me') 
      console.log(res);
      
      user.value = res.user
      return res.user
      
    } catch (e) {
      user.value = null
    } finally {
      loading.value = false
    }
  }
  const logout=async()=>{
    try{
        await $fetch('/api/auth/logout',{
            method:'POST'
        })
        user.value=null;
        navigateTo('/login')
    }catch(error){
        console.log(error);
        
    }
  }
  
    return {user,fetchUser,logout}
}