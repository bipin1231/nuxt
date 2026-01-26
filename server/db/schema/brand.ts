import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { category } from "./category";

export const brand = pgTable("brand", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),

    

});
