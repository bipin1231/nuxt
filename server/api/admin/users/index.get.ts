import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { getUser } from "~~/server/db/schema/user/getUser";
import { eq } from 'drizzle-orm'


export default defineEventHandler(async (event)=>{

    try{
        const res = await db
  .select()
  .from(getUser)
  .where(eq(getUser.is_customer, false))

        return res;
    }catch(error){
        console.error("Error fetching users:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        })
    }
})