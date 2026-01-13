import { addUser,findUser } from "../utils/user"
export default defineEventHandler(async (event)=>{
    const body=await readBody(event);

    if(!body.email || !body.password){
        throw createError({
            statusCode:400,
            message:"fill all the fields",
        })
    }
    if(findUser(body.email)){
        throw createError({
            statusCode:400,
            message:"User with this email already exists",
        })
    }

    addUser(body)
    return body
    

})