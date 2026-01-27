import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { category } from "./category";
import { brand } from "./brand";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),

  description: text("description").notNull(),
 
  thumbnail: text("thumbnail").notNull(),
  images: text("images").array().notNull(),

  brandId: integer('brand_id')
    .references(() => brand.id, { onDelete: 'cascade' }),

  categoryId: integer('category_id')
    .notNull()
    .references(() => category.id, { onDelete: 'cascade' }),
});
