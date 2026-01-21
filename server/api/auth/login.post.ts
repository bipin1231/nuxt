import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "~~/server/db/client";
import { users } from "~~/server/db/schema/user";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 const userSchema=z.object({
    email:z.string(),
    password:z.string().min(6)
 })
const JWT_SECRET = process.env.JWT_SECRET || ""
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
    

    const singingObj={
        userId:user.id,
        role:user.role
    }
    const token=jwt.sign(singingObj,JWT_SECRET, { expiresIn: '24h' })
    console.log("jwt token",token);
    

    setCookie(event,'token',token,{
    httpOnly: true,
    maxAge: 60 * 60*48, 
    path: '/',
    sameSite: 'lax',
    })
  return {
    message: 'Login successful',
  }


})