import { requireAdmin } from "~~/server/lib/middleware/admin";
import { requireAuth } from "~~/server/lib/middleware/auth";

export default defineEventHandler((event)=>{
 requireAuth(event)
requireAdmin(event)
    console.log("kya hal baa");
    
})