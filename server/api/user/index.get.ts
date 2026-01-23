import { db } from "~~/server/db/client"
import { getUser } from "~~/server/db/schema/user/getUser"



export default defineEventHandler(async (event) => {

    const res=await db.select().from(getUser);
   return res;
    
})
