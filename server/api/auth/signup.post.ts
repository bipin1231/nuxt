import type { User } from "~~/server/types/user";
import { db } from "~~/server/db/client";
import { users } from "~~/server/db/schema/user";
import bcrypt from 'bcrypt'
import {z} from 'zod'
import { eq } from "drizzle-orm";

export const createUserSchema=z.object({
    name:z.string().min(2).max(100),
    email:z.string(),
    password:z.string().min(6).max(100),
})

export default defineEventHandler(async (event)=>{

   const body=await readBody(event);
   
 
   
    const data = createUserSchema.parse(body)
   
   const {name,email,password}= data;

   try{
 
    const existUser=await db.select().from(users).where(eq(users.email,email))
    console.log(existUser);
    
    if(existUser.length>0) throw createError({statusMessage:"User with this email already exist"})
       
        
 const hashedPassword= await bcrypt.hash(password,10);
      
   const res=await db.insert(users).values({
    name:name,
    email:email,
    password:hashedPassword,
    role:'user'
   });
        
   }catch(err){
throw err
   }

   



})