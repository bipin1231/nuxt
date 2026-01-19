
import fs from 'fs'
import path from 'path'
import { addProduct } from "~~/server/utils/products"
export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData)
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })

 
  const title = formData.find(f => f.name === 'title')?.data?.toString()
  const price = Number(formData.find(f => f.name === 'price')?.data)
  console.log(title);
  console.log(price);
  
  

  const image = formData.find(f => f.name === 'image')

  console.log(image);
  
  if (!title || !price || !image)
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })


  const uploadDir = path.join(process.cwd(), 'public/uploads/products')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

 
  const filename = image.filename
  fs.writeFileSync(path.join(uploadDir, filename), image.data)

 
  const product = {
    title,
    price,
    thumbnail: `/uploads/products/${filename}`
  }

  addProduct(product)

  console.log(product)

  return {
    success: true,
    product
  }
})
