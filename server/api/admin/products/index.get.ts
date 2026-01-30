import { eq, ilike, or } from "drizzle-orm";
import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { brand } from "~~/server/db/schema/brand";
import { category } from "~~/server/db/schema/category";
import { products } from "~~/server/db/schema/products";
import { productVariants } from "~~/server/db/schema/productVariants";
import { sizes } from "~~/server/db/schema/sizes";
import { requireAdmin } from "~~/server/lib/admin";
import { requireAuth } from "~~/server/lib/auth";

export default defineEventHandler(async (event)=>{
 requireAuth(event)
requireAdmin(event)


const {search} = getQuery(event);

if(search){
    const res = await db
      .select({
        id: products.id,
        title: products.title,
        description:products.description,
        thumbnail:products.thumbnail,
        images:products.images,
        category: category.title,
        brand:brand.title,
        
      })
      .from(products)
      .leftJoin(
        category,
        eq(products.categoryId, category.id)
      ).leftJoin(
        brand,
        eq(products.brandId, brand.id)
      ).where(
      or(
ilike(products.title,`%${search}%`),
ilike(category.title,`%${search}%`)
      )     
    ) 
    return res;
}

  const res = await db
      .select({
        id: products.id,
        title: products.title,
        description:products.description,
        thumbnail:products.thumbnail,
        images:products.images,
        category: category.title,
        brand:brand.title,
        
      })
      .from(products)
      .leftJoin(
        category,
        eq(products.categoryId, category.id)
      ).leftJoin(
        brand,
        eq(products.brandId, brand.id)
      )


    return res
})