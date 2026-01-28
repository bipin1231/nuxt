import { eq } from "drizzle-orm";
import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { category } from "~~/server/db/schema/category";
import { products } from "~~/server/db/schema/products";
import { productVariants } from "~~/server/db/schema/productVariants";
import { sizes } from "~~/server/db/schema/sizes";


export default defineEventHandler(async (event)=>{

    const {productId}=getQuery(event)
    const result = await db
      .select({
        id:productVariants.id,
        sellingPrice:productVariants.sellingPrice,
        costPrice:productVariants.costPrice,
        stock:productVariants.stock,
        size:sizes.title
      })
      .from(productVariants)
       .leftJoin(
        sizes,
        eq(productVariants.sizeId,sizes.id)
     )
     .where(eq(productVariants.productId,Number(productId)))
    

    return result
})