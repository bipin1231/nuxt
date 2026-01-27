import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { category } from "./category";
import { brand } from "./brand";
import { products } from "./products";
import { sizes } from "./sizes";

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),

  costPrice: integer("cost_price").notNull(),
  sellingPrice: integer("selling_price").notNull(),
  stock: integer("stock").notNull(),

 sizeId: integer('size_id')
    .references(() => sizes.id, { onDelete: 'cascade' }),

  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' }),


});
