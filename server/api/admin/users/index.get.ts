import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { getUser } from "~~/server/db/schema/user/getUser";
import { and, eq, ilike, or } from 'drizzle-orm'
import { users } from "~~/server/db/schema/user";
import { log } from "console";


export default defineEventHandler(async (event)=>{

    const { search, role } = getQuery(event)
    console.log(search,role);
    
    try{
        if(!search && !role){
    
            
        return await db
  .select()
  .from(getUser)
  .where(eq(getUser.is_customer, false))
        }

 
       
if (search && role) {
return await db
      .select()
    .from(getUser)
    .where(
      and(
        or(
          ilike(getUser.name, `%${search}%`),
          ilike(getUser.email, `%${search}%`),
          ilike(getUser.role, `%${search}%`)
        ),
        eq(getUser.role, role as string),
        eq(getUser.is_customer, false)
      )
    )
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
          ilike(getUser.role, `%${search}%`)
        ),
        
        eq(getUser.is_customer, false)
      )
    )
}
   
if (role) {
return await db
      .select()
    .from(getUser)
    .where(
      and(
        eq(getUser.role, role as string),
        eq(getUser.is_customer, false)
      )
    )
}     
    }catch(error){
        console.error("Error fetching users:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        })
    }
})