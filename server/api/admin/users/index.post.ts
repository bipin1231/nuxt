import { z } from "zod";
import type { MultiPartData } from 'h3'
import path from "path";
import fs from "fs";
import { db } from "~~/server/db/client";
import { users } from "~~/server/db/schema/user"
import bcrypt from 'bcrypt';
export const createUserSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string(),
    role:z.string(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
})
const separateFormData = (data: MultiPartData[]) => {
    const textData: Record<string, string> = {}
    const imageData: MultiPartData[] = []

    for (const d of data) {
        if (d.filename) {
            imageData.push(d)
        } else {
            if (!d.name) throw new Error('Form field missing name')
            textData[d.name] = d.data.toString()
        }
    }

    return { textData, imageData }
}
export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event);
    const { textData, imageData } = separateFormData(body || []);
    const parsedData = createUserSchema.parse(textData);


    const { name, email, password, confirmPassword, role } = parsedData;

    if (password !== confirmPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: "Password and Confirm Password do not match"
        })
    }

    let filename = '';

    if (imageData.length !== 0) {
        const uploadDir = path.join(process.cwd(), 'public/uploads/products')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const file = imageData[0]
        filename = `${Date.now()}-${file.filename || 'file.png'}`
        fs.writeFileSync(path.join(uploadDir, filename), file.data)
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const res = await db.insert(users).values({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            avatar:filename?`/uploads/products/${filename}`:null,
            is_customer: false,
        });
        console.log(res);
        
    } catch (error) {
        console.error("Error inserting user:", error);
    }

    return { message: "User data added" };



})