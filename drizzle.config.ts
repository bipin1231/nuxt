import type { Config } from 'drizzle-kit'

export default {
  schema: './server/db/schema',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://postgres:postgres@localhost:5432/ecommerce",
  },
} satisfies Config
