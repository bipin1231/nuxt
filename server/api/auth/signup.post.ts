import type { User } from "~~/server/types/user";
import { db } from "~~/server/db/client";
import { users } from "~~/server/db/schema/user";
import bcrypt from 'bcrypt'
import {z} from 'zod'

export const createUserSchema=z.object({
    name:z.string().min(2).max(100),
    email:z.string(),
    password:z.string().min(6).max(100),
})

export default defineEventHandler(async (event)=>{

   const body=await readBody(event);
   
 
   
    const data = createUserSchema.parse(body)
   
   const {name,email,password}= data;

   

   const hashedPassword= await bcrypt.hash(password,10);
   
   
   const res=await db.insert(users).values({
    name:name,
    email:email,
    password:hashedPassword,
   });

   return data
})