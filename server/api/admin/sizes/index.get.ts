import { z } from "zod"
import type { MultiPartData } from 'h3'
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema/products"
import fs from 'fs'
import path from 'path'
import { category } from "~~/server/db/schema/category"
import { brand } from "~~/server/db/schema/brand"
import { sizes } from "~~/server/db/schema/sizes"
import { eq, ilike, or } from "drizzle-orm"

export default defineEventHandler(async (event) => {


const {search} = getQuery(event);
if (search) {
    const res=await db.select({
      id: sizes.id,
      title: sizes.title,
      categoryId: sizes.categoryId,
      categoryName: category.title, 
    }).from(sizes).where(
      or(
ilike(sizes.title,`%${search}%`),
ilike(category.title,`%${search}%`)
      )
        
    ) .innerJoin(category, eq(sizes.categoryId, category.id));
    return res
    
}
 const res = await db
    .select({
      id: sizes.id,
      title: sizes.title,
      categoryId: sizes.categoryId,
      categoryName: category.title, 
    })
    .from(sizes)
    .innerJoin(category, eq(sizes.categoryId, category.id));

  return res;

})
