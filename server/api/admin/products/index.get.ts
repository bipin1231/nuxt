import { eq } from "drizzle-orm";
import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { brand } from "~~/server/db/schema/brand";
import { category } from "~~/server/db/schema/category";
import { products } from "~~/server/db/schema/products";
import { productVariants } from "~~/server/db/schema/productVariants";
import { sizes } from "~~/server/db/schema/sizes";
import { requireAdmin } from "~~/server/lib/middleware/admin";
import { requireAuth } from "~~/server/lib/middleware/auth";

export default defineEventHandler(async (event)=>{
//  requireAuth(event)
// requireAdmin(event)

// try{
//     const productsRes = db.select().from(products)
//     return productsRes
// }catch(err:any){
//     console.error(" DB ERROR:", err) 
//     throw createError({
//       statusCode: 500,
//       statusMessage: err.message,
//     })  
// }
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