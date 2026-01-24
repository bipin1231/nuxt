import { eq } from "drizzle-orm"
import { db } from "~~/server/db/client"
import { users } from "~~/server/db/schema/user"

export default defineEventHandler(async(event)=>{
    const id=event.context.params?.id
    if(!id){
        throw createError({
            message:"no id is provided"
        })
    }
     const body =await readBody(event)
     const {role}=body
        try{
        const res=await db.select().from(users).where(eq(users.id,Number(id))).then(res=>res[0])
        if(!res) return "no user found"
        if(!role) return "please enter a valid role"

        const updatedData=await db.update(users).set({role}).where(eq(users.id,Number(id)))
        return "role updated successfully"

    }catch(error){
        console.log(error);
        
    }
   
   
})