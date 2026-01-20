import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  thumbnail: text("thumbnail").notNull(),
});
