import { eq } from "drizzle-orm"
import { th } from "zod/v4/locales"
import { db } from "~~/server/db/client"
import { brand } from "~~/server/db/schema/brand"
import { category } from "~~/server/db/schema/category"
import { sizes } from "~~/server/db/schema/sizes"
import { users } from "~~/server/db/schema/user"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

export default defineEventHandler(async (event)=>{
      hasEditAccess(event)
    const id = event.context.params?.id
    if(!id) throw createError({ message: "No id is provided" })
            
    try {
        const res=await db.select().from(sizes).where(eq(sizes.id,Number(id))).then(res=>res[0])
        if(!res) return "No size found"

        await db.delete(sizes).where(eq(sizes.id,Number(id)))
        return "Size deleted successfully"
    } catch (error) {
        console.log(error);
        throw createError({ message: "Failed to delete brand" })
    }
})