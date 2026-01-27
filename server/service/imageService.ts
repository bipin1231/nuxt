import fs from 'fs'
import path from 'path'
export const imageService=(imageData)=>{
    const uploadDir = path.join(process.cwd(), 'public/uploads/products')
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }
    const imgUrl=[]

    imageData.forEach(imgFile => {
    const file = imgFile
    // const filename = `${Date.now()}-${file.filename || 'file.png'}`
        const filename = `${file.filename || 'file.png'}`
    fs.writeFileSync(path.join(uploadDir, filename), file.data)
    imgUrl.push(`/uploads/products/${filename}`)
        
    });
    return imgUrl;


}