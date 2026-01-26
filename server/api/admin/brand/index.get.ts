import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { category } from "~~/server/db/schema/category"
import { brand } from "~~/server/db/schema/brand"
import { ilike } from "drizzle-orm"

export default defineEventHandler(async (event) => {

const {search} = getQuery(event);
if (search) {
    const res=await db.select().from(brand).where(
        ilike(brand.title,`%${search}%`)
    )
    return res
    
}


    const res=await db.select().from(brand)
    return res

})
