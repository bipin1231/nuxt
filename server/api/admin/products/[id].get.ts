import { getProduct,getProductByIndex } from "~~/server/utils/products"
import { db } from "~~/server/db/client";
import { products } from "~~/server/db/schema/products";
import { eq } from "drizzle-orm";
export default defineEventHandler(async(event)=>{
 const id = event.context.params?.id
try{
    const productsRes = db.select().from(products).where(eq(products.id, Number(id)))
    return productsRes
}catch(err:any){
    console.error(" DB ERROR:", err) 
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })  
}
}
)
