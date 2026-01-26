import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { category } from "~~/server/db/schema/category"
import { brand } from "~~/server/db/schema/brand"

const categorySchema = z.object({
    title: z.string().min(3),
})


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!body) throw createError({ statusCode: 400 })
   
    const parsedData=categorySchema.parse(body)

    const res=await db.insert(brand).values({
        title:parsedData.title
    })

})
