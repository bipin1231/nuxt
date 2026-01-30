import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { category } from "~~/server/db/schema/category"
import { hasEditAccess } from "~~/server/lib/hasEditAccess"

const categorySchema = z.object({
    title: z.string().min(3),
})


export default defineEventHandler(async (event) => {
     hasEditAccess(event)
    const body = await readBody(event)
    if (!body) throw createError({ statusCode: 400 })
   
    const parsedData=categorySchema.parse(body)

    const res=await db.insert(category).values({
        title:parsedData.title
    })

})
