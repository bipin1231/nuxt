import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { imageService } from "~~/server/service/imageService"
import { productVariants } from "~~/server/db/schema/productVariants"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

const productSchema = z.object({
    name: z.string().min(3),
    price: z.preprocess(
        (v) => Number(v),
        z.number().nonnegative()
    ),
})

const separateFormData = (data: MultiPartData[]) => {
    const textData: Record<string, string> = {}
    const imageData: MultiPartData[] = []

    for (const d of data) {
        if (d.filename) {
            imageData.push(d)
        } else {
            if (!d.name) throw new Error('Form field missing name')
            textData[d.name] = d.data.toString()
        }
    }

    return { textData, imageData }
}

export default defineEventHandler(async (event) => {
    hasEditAccess(event)
    const body = await readMultipartFormData(event)
    if (!body) throw createError({ statusCode: 400 })
    // console.log(body);

    const { textData, imageData } = separateFormData(body)
    const variants = textData.productVariants
  ? JSON.parse(textData.productVariants)
  : []
    console.log(textData,imageData);
      if (imageData.length === 0) return "no image data";
    // const parsedData = productSchema.parse(textData)
  const imgurl=imageService(imageData)
   console.log("imgurl",imgurl);
    const productRes=await db.insert(products).values({
        title:textData.title,
        categoryId:Number(textData.categoryId),
        brandId:Number(textData.brandId),
        description:textData.description,
        thumbnail:imgurl[0],
        images:imgurl

    }).returning({ id: products.id })

    variants.forEach(async (v) => {
  await db.insert(productVariants).values({
costPrice:Number(v.costPrice),
sellingPrice:Number(v.sellingPrice),
sizeId:Number(v.sizeId),
stock:Number(v.stock),
productId:Number(productRes[0].id)
  })
        
    });
  
 
console.log("product response",productRes);


})
