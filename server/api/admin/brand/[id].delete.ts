import { eq } from "drizzle-orm"
import { th } from "zod/v4/locales"
import { db } from "~~/server/db/client"
import { brand } from "~~/server/db/schema/brand"
import { category } from "~~/server/db/schema/category"
import { users } from "~~/server/db/schema/user"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

export default defineEventHandler(async (event)=>{
     hasEditAccess(event)
    const id = event.context.params?.id
    if(!id) throw createError({ message: "No id is provided" })
            
    try {
        const res=await db.select().from(brand).where(eq(brand.id,Number(id))).then(res=>res[0])
        if(!res) return "No brand found"

        await db.delete(brand).where(eq(brand.id,Number(id)))
        return "Brand deleted successfully"
    } catch (error) {
        console.log(error);
        throw createError({ message: "Failed to delete brand" })
    }
})