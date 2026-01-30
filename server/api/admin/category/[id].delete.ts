import { eq } from "drizzle-orm"
import { th } from "zod/v4/locales"
import { db } from "~~/server/db/client"
import { category } from "~~/server/db/schema/category"
import { users } from "~~/server/db/schema/user"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

export default defineEventHandler(async (event)=>{
     hasEditAccess(event)
    const id = event.context.params?.id
    if(!id) throw createError({ message: "No id is provided" })
            
    try {
        const res=await db.select().from(category).where(eq(category.id,Number(id))).then(res=>res[0])
        if(!res) return "No category found"

        await db.delete(category).where(eq(category.id,Number(id)))
        return "Category deleted successfully"
    } catch (error) {
        console.log(error);
        throw createError({ message: "Failed to delete category" })
    }
})