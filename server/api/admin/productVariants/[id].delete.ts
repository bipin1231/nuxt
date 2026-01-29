import { eq } from "drizzle-orm"
import { db } from "~~/server/db/client"
import { products } from "~~/server/db/schema"
import { productVariants } from "~~/server/db/schema/productVariants"

export default defineEventHandler(async(event)=>{
 const id = event.context.params?.id

    if(!id) throw createError({ message: "No id is provided" })
            
    try {
        // const res=await db.select().from(products).where(eq(products.id,Number(id))).then(res=>res[0])
        // if(!res) return "No product found"

        await db.delete(productVariants).where(eq(productVariants.id,Number(id)))
        return "Product Varaints deleted successfully"
    } catch (error) {
        console.log(error);
        throw createError({ message: "Failed to delete Product Varaints" })
    }

})