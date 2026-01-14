  import { ref } from 'vue'

export const useAuth = () => {
  const user = useState<string | null>('user', () => null)
  const loading = ref(true)

  // get user info from server
  const fetchUser = async () => {
    try {
      const res = await $fetch('/api/me') // reads cookie
      user.value = res.user
    } catch (e) {
      user.value = null
    } finally {
      loading.value = false
    }
  }
  const logout=async()=>{
    try{
        await $fetch('/api/logout',{
            method:'POST'
        })
        user.value=null;
    }catch(error){
        console.log(error);
        
    }
  }
    // const login=async(data)=>{
    //     try {
    //         const res=$fetch('api/login',{
    //             method:'POST',
    //             body:data
    //         });
    //       await fetchUser();
    //     } catch (error) {
    //         console.log(error);
    //     }
        
    // }
    //     const signup=async(data)=>{
    //     try {
    //         const res=$fetch('api/signup',{
    //             method:'POST',
    //             body:data
    //         });
    //       await fetchUser();
    //     } catch (error) {
    //         console.log(error);
    //     }
        
    // }
    return {user,fetchUser,logout}
}