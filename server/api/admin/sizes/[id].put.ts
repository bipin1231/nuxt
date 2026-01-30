import { eq } from "drizzle-orm"
import { db } from "~~/server/db/client"
import { brand } from "~~/server/db/schema/brand"
import { category } from "~~/server/db/schema/category"
import { sizes } from "~~/server/db/schema/sizes"
import { users } from "~~/server/db/schema/user"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

export default defineEventHandler(async(event)=>{
    
    hasEditAccess(event)

    const id=event.context.params?.id
    if(!id){
        throw createError({
            message:"no id is provided"
        })
    }
     const body =await readBody(event)
     const {title,categoryName}=body
        try{
        const res=await db.select().from(sizes).where(eq(sizes.id,Number(id))).then(res=>res[0])
        if(!res) return "no size found"
        if(!title) return "please enter a valid title"
          const catRes=await db.select().from(category).where(eq(category.title,categoryName))

        const updatedData=await db.update(sizes).set({title,categoryId:catRes[0].id}).where(eq(sizes.id,Number(id)))
        return "size updated successfully"
    }catch(error){
        console.log(error);
        
    }
   
   
})