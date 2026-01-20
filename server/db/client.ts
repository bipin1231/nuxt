import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  password: "postgres",    
  database: "ecommerce",
  host: "localhost",
  port: 5432,
});

pool.query("SELECT current_database(), current_user;")
  .then(res => console.log("DB CHECK:", res.rows))
  .catch(err => console.error("DB CHECK ERROR:", err));

export const db = drizzle(pool);
