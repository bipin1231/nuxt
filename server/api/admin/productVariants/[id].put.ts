import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { and, eq, ne } from "drizzle-orm"
import { imageService } from "~~/server/service/imageService"
import { productVariants } from "~~/server/db/schema/productVariants"


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!body) throw createError({ statusCode: 400 })


    const id = Number(event.context.params?.id)

const productsRes = await db
  .select()
  .from(productVariants)
  .where(eq(productVariants.id, id))


if (productsRes.length === 0) {
  return "no product variants found"
}
const productVar=productsRes[0]
const exists = await db
  .select()
  .from(productVariants)
  .where(
    and(
      eq(productVariants.productId, productVar.productId),
      eq(productVariants.sizeId, body.sizeId),
      ne(productVariants.id, id)
    )
  )

if (exists.length > 0) {
  throw createError({
    statusCode: 409,
    statusMessage: 'This size already exists for this product',
  })
}


console.log("body data",body);


const res = await db  
  .update(productVariants)
.set({
  sellingPrice: body.sellingPrice ?? Number(productVar.sellingPrice),
  costPrice: body.costPrice ?? Number(productVar.costPrice),
  sizeId: body.sizeId ?? Number(productVar.sizeId),
  stock: body.stock ?? Number(productVar.stock),
})
  .where(eq(productVariants.id, id))
  console.log(res);
  

return res

})
