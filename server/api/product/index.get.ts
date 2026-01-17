import { getProduct } from "~~/server/utils/products"
export default defineEventHandler(async(event)=>{

 return getProduct()
}
)
