import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { category } from "./category";

export const sizes = pgTable("sizes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
categoryId: integer('category_id')
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
});
