import { ca } from "zod/v4/locales";
import { db } from "~~/server/db/client";
import { products } from "~~/server/db/schema/products";
import { requireAdmin } from "~~/server/lib/middleware/admin";
import { requireAuth } from "~~/server/lib/middleware/auth";

export default defineEventHandler((event)=>{
//  requireAuth(event)
// requireAdmin(event)

try{
    const productsRes = db.select().from(products)
    return productsRes
}catch(err:any){
    console.error(" DB ERROR:", err) 
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })  
}
    
})