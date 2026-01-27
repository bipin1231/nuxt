import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { eq } from "drizzle-orm"
import { imageService } from "~~/server/service/imageService"

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
    const body = await readMultipartFormData(event)
    if (!body) throw createError({ statusCode: 400 })
    console.log(body);

    const { textData, imageData } = separateFormData(body)

    console.log("textDAta",textData);
    console.log("imageData",imageData);

    const id = Number(event.context.params?.id)

const productsRes = await db
  .select()
  .from(products)
  .where(eq(products.id, id))


if (productsRes.length === 0) {
  return "no product found"
}
const product = productsRes[0]
const foundThumbnail= product.images.find(i=>i==textData.thumbnail)

console.log("foundThumbnail",foundThumbnail);


    

//     const parsedData = productSchema.parse(textData)

    let newImgUrl=[];
    if (imageData.length !== 0){
   newImgUrl=imageService(imageData)
    }

    console.log("new image url",newImgUrl);
    
const newThumbnail=newImgUrl[0];
newImgUrl=[textData.dbImages,...newImgUrl]
const categoryId=textData.categoryId?Number(textData.categoryId):product.categoryId
const brandId=textData.brandId?Number(textData.brandId):product.brandId


const res = await db
  .update(products)
  .set({
    title: textData.title,
    images:newImgUrl,
    categoryId:categoryId,
    brandId:brandId,
    description:textData.description,
    thumbnail: foundThumbnail
      ? foundThumbnail
      : newThumbnail,
  })
  .where(eq(products.id, id))

return res

})
