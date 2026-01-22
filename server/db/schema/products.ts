import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { category } from "./category";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  brand: text("brand").notNull(),
  thumbnail: text("thumbnail").notNull(),


  categoryId: integer('category_id')
    .notNull()
    .references(() => category.id, { onDelete: 'cascade' }),
});
