DROP TABLE "item" CASCADE;--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;