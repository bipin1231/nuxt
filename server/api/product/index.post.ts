import { db } from "~~/server/db/client";
import { products } from "~~/server/db/schema";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1),
  price: z.number().int().positive(),
  thumbnail: z.string().url(),
});
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const result = await db.insert(products).values({
      title: body.title,
      price: body.price,
      thumbnail: body.thumbnail,
    }).returning()

    return result[0]
  } catch (err: any) {
    console.error(" DB ERROR:", err) 
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})

