import { getProduct,getProductByIndex,updateProductByIndex } from "~~/server/utils/products"
import fs from 'fs'
import path from 'path'
export default defineEventHandler(async(event)=>{
 const id = event.context.params?.id
 const oldProduct = getProductByIndex(id);
const formData = await readMultipartFormData(event)
  if (!formData)
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })

 
  let title = formData.find(f => f.name === 'title')?.data?.toString()
  let price = Number(formData.find(f => f.name === 'price')?.data)
    const image = formData.find(f => f.name === 'image')
    let filename;
if(image){
     const uploadDir = path.join(process.cwd(), 'public/uploads/products')
     if (!fs.existsSync(uploadDir)) {
         fs.mkdirSync(uploadDir, { recursive: true })
       }
     
      
        filename = image.filename
       fs.writeFileSync(path.join(uploadDir, filename), image.data)
    }
    if(!filename) filename=oldProduct.thumbnail
    if(!title) title=oldProduct.title
    if(!price) price=oldProduct.price
      
       const product = {
         title,
         price,
         thumbnail: `/uploads/products/${filename}`
       }
       updateProductByIndex(id, product)

       console.log(product)

       return {
         success: true,
         product
       }

}
)
