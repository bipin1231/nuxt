import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { category } from "~~/server/db/schema/category"
import { brand } from "~~/server/db/schema/brand"
import { eq } from "drizzle-orm"
import { sizes } from "~~/server/db/schema/sizes"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

// const categorySchema = z.object({
//     title: z.string().min(3),
// })


export default defineEventHandler(async (event) => {
     hasEditAccess(event)
    const body = await readBody(event)
    if (!body) throw createError({ statusCode: 400 })
   
   
const {categoryName,title}=body
console.log(categoryName,title);


try{
    const res=await db.select().from(category).where(eq(category.title,categoryName))
    console.log(res);
    
    if(!res) return "no categoyr found with this id"
    
  const insertedData=  await db.insert(sizes).values({
    title,
    categoryId: Number(res[0].id),
  })
 
  
}catch(error){
    console.error("Error inserting size:", error);
  throw createError({ statusCode: 500, statusMessage: String(error) });
} 
})
