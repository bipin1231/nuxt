import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "~~/server/db/client";
import { users } from "~~/server/db/schema/user";
import bcrypt from 'bcrypt'

 const userSchema=z.object({
    email:z.string(),
    password:z.string().min(6)
 })

export default defineEventHandler(async(event)=>{
    const body=await readBody(event)

    const data=userSchema.parse(body)
    const {email,password}=data;

    const user=await db.select().from(users).where(eq(users.email,email))
                    .then(res=>res[0])
    if(!user) return createError({statusCode:400,message:'Invalid email or password'})

    const isValid=await bcrypt.compare(password,user.password)
    
    if(!isValid)     
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  return {
    message: 'Login successful',
    userId: user.id,
  }


})