import type { db } from "@/db";

// Type for the database client (either main db or transaction)
export type DatabaseClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
