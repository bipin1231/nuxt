import { getProduct,getProductByIndex } from "~~/server/utils/products"
import { db } from "~~/server/db/client";
import { products } from "~~/server/db/schema/products";
import { eq } from "drizzle-orm";
import { category } from "~~/server/db/schema/category";
import { brand } from "~~/server/db/schema/brand";
export default defineEventHandler(async(event)=>{
 const id = event.context.params?.id
try{
    const productsRes = await db.select({
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
          ).where(eq(products.id, Number(id)))
 return productsRes[0] ?? null
}catch(err:any){
    console.error(" DB ERROR:", err) 
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })  
}
}
)
