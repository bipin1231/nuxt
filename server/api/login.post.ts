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

    const cookieData={
      email:body.email,
      role:user.role
    }
 
  setCookie(event, 'user',JSON.stringify(cookieData),{ path: '/' })

  return {
    email: body.email,
    role: user.role
  }
})
