
import { pgTable, serial, varchar, integer, timestamp,boolean } from 'drizzle-orm/pg-core'


export const getUser=pgTable('users',{
    id:serial('id').primaryKey(),
    name:varchar('name',{length:100}).notNull(),
    email:varchar('email',{length:100}).notNull().unique(),
    role:varchar('role',{length:100}),
    is_customer: boolean('is_customer'),
    avatar:varchar('avatar',{length:255}),
})