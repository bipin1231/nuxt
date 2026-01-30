import { eq } from "drizzle-orm"
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

export default defineEventHandler(async(event)=>{
    hasEditAccess(event)
 const id = event.context.params?.id

    if(!id) throw createError({ message: "No id is provided" })
            
    try {
        // const res=await db.select().from(products).where(eq(products.id,Number(id))).then(res=>res[0])
        // if(!res) return "No product found"

        await db.delete(products).where(eq(products.id,Number(id)))
        return "Category deleted successfully"
    } catch (error) {
        console.log(error);
        throw createError({ message: "Failed to delete category" })
    }

})