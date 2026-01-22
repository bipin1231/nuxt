import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),

});
