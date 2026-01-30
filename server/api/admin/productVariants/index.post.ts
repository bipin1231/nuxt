import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { imageService } from "~~/server/service/imageService"
import { productVariants } from "~~/server/db/schema/productVariants"
import { and, eq, ne } from "drizzle-orm"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

const productSchema = z.object({
    name: z.string().min(3),
    price: z.preprocess(
        (v) => Number(v),
        z.number().nonnegative()
    ),
})



export default defineEventHandler(async (event) => {
  hasEditAccess(event)
    const body = await readBody(event)
  
    
    if (!body) throw createError({ statusCode: 400 })
       

    if(!body.productId){
        throw createError({ message:"no product id is provided"})
    }

    const productId=Number(body.productId)
      

const exists = await db
  .select()
  .from(productVariants)
  .where(
    and(
      eq(productVariants.productId, productId),
      eq(productVariants.sizeId, body.sizeId),

    )
  )
if (exists.length > 0) {
  throw createError({
    statusCode: 409,
    statusMessage: 'Variant with this size already exists',
  })
}
 

   
  await db.insert(productVariants).values({
costPrice:Number(body.costPrice),
sellingPrice:Number(body.sellingPrice),
sizeId:Number(body.sizeId),
stock:Number(body.stock),
productId:Number(body.productId)
  })
 
 



})
