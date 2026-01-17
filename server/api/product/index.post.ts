
import { addProduct } from "~~/server/utils/products";
export default defineEventHandler(async(event)=>{

    const res=await readBody(event)

   const addedProduct= addProduct(res)

    return "product added successfully";
})