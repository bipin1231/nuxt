import { eq } from "drizzle-orm"
import { th } from "zod/v4/locales"
import { db } from "~~/server/db/client"
import { users } from "~~/server/db/schema/user"

export default defineEventHandler(async (event)=>{
    const id = event.context.params?.id
    if(!id) throw createError({ message: "No id is provided" })
            
    try {
        const res=await db.select().from(users).where(eq(users.id,Number(id))).then(res=>res[0])
        if(!res) return "No user found"

        await db.delete(users).where(eq(users.id,Number(id)))
        return "User deleted successfully"
    } catch (error) {
        console.log(error);
        throw createError({ message: "Failed to delete user" })
    }
})