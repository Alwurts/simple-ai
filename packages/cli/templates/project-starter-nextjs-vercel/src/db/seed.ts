import { drizzle } from "drizzle-orm/node-postgres";
import { nanoid } from "nanoid";
import { Pool } from "pg";
import * as schema from "@/db/schema";

// Create database connection directly for seeding
const postgresUrl =
	process.env.POSTGRES_URL || "postgresql://devuser:devpassword@127.0.0.1:5439/postgres";
const pool = new Pool({
	connectionString: postgresUrl,
});
const db = drizzle(pool, { schema });

const resetEnv = process.argv.includes("--resetEnv");

async function main() {
	console.log("🌱 Starting database seeding...");

	// Reset database before seeding
	if (resetEnv) {
		console.log("🧹 Resetting database...");
		await db.execute(`TRUNCATE TABLE messages CASCADE`);
		await db.execute(`TRUNCATE TABLE chats CASCADE`);
		await db.execute(`TRUNCATE TABLE movements CASCADE`);
		await db.execute(`TRUNCATE TABLE stock_levels CASCADE`);
		await db.execute(`TRUNCATE TABLE products CASCADE`);
		await db.execute(`TRUNCATE TABLE warehouses CASCADE`);
		await db.execute(`TRUNCATE TABLE session CASCADE`);
		await db.execute(`TRUNCATE TABLE account CASCADE`);
		await db.execute(`TRUNCATE TABLE verification CASCADE`);
		await db.execute(`TRUNCATE TABLE "user" CASCADE`);
		console.log("✅ Database reset complete");
	}

	// Create test users
	console.log("👤 Creating test users...");

	const users = [
		{
			id: nanoid(),
			name: "Test User",
			email: "test@example.com",
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: nanoid(),
			name: "Admin User",
			email: "admin@example.com",
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	for (const user of users) {
		await db.insert(schema.user).values(user);
		console.log(`   Created user: ${user.email}`);
	}

	// Create accounts with passwords
	console.log("🔐 Creating user accounts with passwords...");

	const accountPasswordHash = // "Test1234"
		"430d7595ff3a901393e9015b2e3c7798:14b72c86bca1bfbcc92337436b63f142ef5fdbae6c854027cffc7a3baad1ba56cb67893632c508f649a72942f4c9585dd9b70494ffba36dae14709f84ce4c36c";

	for (const user of users) {
		await db.insert(schema.account).values({
			id: nanoid(),
			accountId: nanoid(),
			providerId: "credential",
			userId: user.id,
			password: accountPasswordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log(`   Created account for: ${user.email} (password: Test1234)`);
	}

	// Seed inventory data for each user
	for (const user of users) {
		console.log(`\n📦 Seeding inventory for ${user.email}...`);

		// Create warehouses
		const warehouseNames = ["Main Warehouse", "Storage Facility", "East Coast Distribution"];

		const warehouses = [];
		for (const name of warehouseNames) {
			const warehouse = await db
				.insert(schema.warehouses)
				.values({
					id: crypto.randomUUID(),
					userId: user.id,
					name,
					location: `${name}, USA`,
					createdAt: new Date().toISOString(),
				})
				.returning();
			warehouses.push(warehouse[0]);
			console.log(`   Created warehouse: ${name}`);
		}

		// Create products
		const productsData = [
			{
				sku: "ELEC-001",
				name: "Wireless Bluetooth Headphones",
				description:
					"High-quality wireless headphones with noise cancellation and 20-hour battery life.",
				price: "149.99",
				cost: "75.00",
				minStockLevel: 10,
			},
			{
				sku: "ELEC-002",
				name: "USB-C Fast Charging Cable",
				description: "3-meter braided USB-C cable with fast charging support.",
				price: "19.99",
				cost: "4.50",
				minStockLevel: 25,
			},
			{
				sku: "ELEC-003",
				name: "Portable Power Bank 20000mAh",
				description: "High-capacity power bank with dual USB outputs and LED indicator.",
				price: "49.99",
				cost: "22.00",
				minStockLevel: 15,
			},
			{
				sku: "OFF-001",
				name: "Ergonomic Office Chair",
				description: "Adjustable ergonomic chair with lumbar support and mesh back.",
				price: "299.99",
				cost: "150.00",
				minStockLevel: 5,
			},
			{
				sku: "OFF-002",
				name: "Standing Desk Frame",
				description: "Electric height-adjustable desk frame with memory presets.",
				price: "399.99",
				cost: "200.00",
				minStockLevel: 3,
			},
			{
				sku: "OFF-003",
				name: "LED Desk Lamp",
				description:
					"Adjustable LED desk lamp with multiple brightness levels and color temperatures.",
				price: "59.99",
				cost: "25.00",
				minStockLevel: 20,
			},
			{
				sku: "HOME-001",
				name: "Smart WiFi Security Camera",
				description: "1080p HD security camera with night vision and two-way audio.",
				price: "89.99",
				cost: "40.00",
				minStockLevel: 12,
			},
			{
				sku: "HOME-002",
				name: "Smart Thermostat",
				description: "WiFi-enabled thermostat with programmable schedules and energy monitoring.",
				price: "129.99",
				cost: "60.00",
				minStockLevel: 8,
			},
			{
				sku: "HOME-003",
				name: "Motion Sensor LED Light Strip",
				description: "16.4ft LED light strip with motion sensor and remote control.",
				price: "34.99",
				cost: "15.00",
				minStockLevel: 30,
			},
			{
				sku: "KITCH-001",
				name: "Digital Kitchen Scale",
				description: "Precision digital scale with tare function and LCD display.",
				price: "24.99",
				cost: "10.00",
				minStockLevel: 25,
			},
			{
				sku: "KITCH-002",
				name: "Immersion Blender",
				description: "Powerful immersion blender with multiple speed settings and attachments.",
				price: "79.99",
				cost: "35.00",
				minStockLevel: 10,
			},
			{
				sku: "KITCH-003",
				name: "Food Storage Container Set",
				description: "Set of 10 BPA-free food storage containers with snap-lock lids.",
				price: "44.99",
				cost: "18.00",
				minStockLevel: 20,
			},
		];

		const products = [];
		for (const productData of productsData) {
			const product = await db
				.insert(schema.products)
				.values({
					id: crypto.randomUUID(),
					userId: user.id,
					sku: productData.sku,
					name: productData.name,
					description: productData.description,
					price: productData.price,
					cost: productData.cost,
					minStockLevel: productData.minStockLevel,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				})
				.returning();
			products.push(product[0]);
			console.log(`   Created product: ${productData.sku} - ${productData.name}`);
		}

		// Create stock levels (some below min_stock_level for testing alerts)
		console.log("   Creating stock levels...");
		for (const product of products) {
			for (const warehouse of warehouses) {
				// Generate stock levels, with some below minimum
				const isLowStock = Math.random() < 0.3; // 30% chance of low stock
				let quantity: number;
				const minStockLevel = product.minStockLevel ?? 5;
				if (isLowStock) {
					quantity = Math.floor(Math.random() * minStockLevel); // 0 to minStockLevel-1
				} else {
					quantity = minStockLevel + Math.floor(Math.random() * 50) + 10;
				}

				await db.insert(schema.stockLevels).values({
					id: crypto.randomUUID(),
					productId: product.id,
					warehouseId: warehouse.id,
					quantity,
					updatedAt: new Date().toISOString(),
				});
			}
		}

		// Create sample movements (IN, OUT, TRANSFER, ADJUSTMENT)
		console.log("   Creating inventory movements...");
		const movementTypes = ["IN", "OUT", "TRANSFER", "ADJUSTMENT"] as const;
		const notes = [
			"Initial stock receipt",
			"Customer order fulfillment",
			"Transfer to warehouse",
			"Stock adjustment after inventory count",
			"Damaged goods removal",
			"Restock from supplier",
			"Return from customer",
		];

		for (let i = 0; i < 20; i++) {
			const product = products[Math.floor(Math.random() * products.length)];
			const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
			const quantity = Math.floor(Math.random() * 20) + 1;
			const note = notes[Math.floor(Math.random() * notes.length)];

			const movement = {
				id: crypto.randomUUID(),
				userId: user.id,
				productId: product.id,
				type,
				quantity,
				notes: note,
				createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Within last 30 days
			};

			if (type === "TRANSFER") {
				const fromWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
				const toWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
				if (fromWarehouse.id !== toWarehouse.id) {
					await db.insert(schema.movements).values({
						...movement,
						fromWarehouseId: fromWarehouse.id,
						toWarehouseId: toWarehouse.id,
					});
				}
			} else {
				await db.insert(schema.movements).values(movement);
			}
		}
		console.log("   Created 20 inventory movements");
	}

	console.log("\n✨ Database seeding completed successfully!");
	console.log("\n📋 Test accounts:");
	console.log("   Email: test@example.com");
	console.log("   Password: Test1234");
	console.log("\n   Email: admin@example.com");
	console.log("   Password: Test1234");
}

main().catch((error) => {
	console.error("❌ Error seeding database:", error);
	process.exit(1);
});
