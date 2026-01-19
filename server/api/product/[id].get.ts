import { getProduct,getProductByIndex } from "~~/server/utils/products"
export default defineEventHandler(async(event)=>{
 const id = event.context.params?.id
 return getProductByIndex(id);
}
)
