import { addUser,findUser } from "../utils/user"
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user=findUser(body.email);
     if(!user || user.password!==body.password){
        throw createError({
            statusCode:401,
            message:"Invalid credentials",
        })
    }

 
  setCookie(event, 'user', body.email,{ path: '/' })

  return {
    email: body.email
  }
})
