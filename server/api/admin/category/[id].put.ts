import { eq } from "drizzle-orm"
import { db } from "~~/server/db/client"
import { category } from "~~/server/db/schema/category"
import { users } from "~~/server/db/schema/user"

export default defineEventHandler(async(event)=>{
    const id=event.context.params?.id
    if(!id){
        throw createError({
            message:"no id is provided"
        })
    }
     const body =await readBody(event)
     const {title}=body
        try{
        const res=await db.select().from(category).where(eq(category.id,Number(id))).then(res=>res[0])
        if(!res) return "no category found"
        if(!title) return "please enter a valid title"

        const updatedData=await db.update(category).set({title}).where(eq(category.id,Number(id)))
        return "category updated successfully"

    }catch(error){
        console.log(error);
        
    }
   
   
})