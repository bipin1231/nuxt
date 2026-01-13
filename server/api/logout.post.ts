export default defineEventHandler(async(event)=>{
    deleteCookie(event,'user',{ path: '/' })
    return{
        "success":true
    }
})