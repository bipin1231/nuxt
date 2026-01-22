import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { eq } from "drizzle-orm"

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

    const parsedData = productSchema.parse(textData)

    let filename;
    if (imageData.length !== 0){
    const uploadDir = path.join(process.cwd(), 'public/uploads/products')
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const file = imageData[0]
     filename = `${Date.now()}-${file.filename || 'file.png'}`
    fs.writeFileSync(path.join(uploadDir, filename), file.data)
    }

const id = Number(event.context.params?.id)

const productsRes = await db
  .select()
  .from(products)
  .where(eq(products.id, id))

if (productsRes.length === 0) {
  return "no product found"
}

const product = productsRes[0]

const res = await db
  .update(products)
  .set({
    title: parsedData.name,
    price: parsedData.price,
    thumbnail: filename
      ? `/uploads/products/${filename}`
      : product.thumbnail,
  })
  .where(eq(products.id, id))

return res

})
