import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { getUser } from "~~/server/db/schema/user/getUser";
import { and, eq, ilike, or } from 'drizzle-orm'
import { users } from "~~/server/db/schema/user";
import { log } from "console";


export default defineEventHandler(async (event) => {

    const { search } = getQuery(event)
    console.log(search);

    try {
        if (!search) {


            return await db
                .select()
                .from(getUser)
                .where(eq(getUser.is_customer, true))
        }





        if (search) {
            return await db
                .select()
                .from(getUser)
                .where(
                    and(
                        or(
                            ilike(getUser.name, `%${search}%`),
                            ilike(getUser.email, `%${search}%`),
                           
                        ),

                        eq(getUser.is_customer, true)
                    )
                )
        }


    } catch (error) {
        console.error("Error fetching users:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        })
    }
})