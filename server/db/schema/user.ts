import { pgTable, serial, varchar, integer,boolean, timestamp } from 'drizzle-orm/pg-core'


export const users=pgTable('users',{
    id:serial('id').primaryKey(),
    name:varchar('name',{length:100}).notNull(),
    email:varchar('email',{length:100}).notNull().unique(),
    password:varchar('password',{length:255}).notNull(),
    role:varchar('role',{length:100}),
    is_customer: boolean('is_customer')
    .default(true)
    .notNull(),
    avatar:varchar('avatar',{length:255}),
    created_at:timestamp('created_at').defaultNow().notNull(),
})