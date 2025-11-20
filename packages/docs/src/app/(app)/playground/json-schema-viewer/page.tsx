import { z } from "zod";
import { JsonSchemaViewer } from "@/registry/ui/json-schema-viewer";

// Example Zod schemas for demonstration
const userSchema = z
	.object({
		name: z.string().describe("The user's full name"),
		email: z.string().email().describe("The user's email address"),
		age: z
			.number()
			.int()
			.min(0)
			.max(150)
			.describe("The user's age in years"),
		isActive: z.boolean().describe("Whether the user account is active"),
		role: z
			.enum(["admin", "user", "moderator"])
			.describe("The user's role in the system"),
	})
	.describe("A user profile schema with various field types");

const apiResponseSchema = z
	.union([
		z.object({
			success: z.literal(true),
			data: z.object({
				id: z.string(),
				name: z.string(),
				createdAt: z.string().datetime(),
			}),
		}),
		z.object({
			success: z.literal(false),
			error: z.object({
				code: z.string(),
				message: z.string(),
			}),
		}),
	])
	.describe(
		"API response schema showing union types for success/error responses",
	);

const productSchema = z
	.object({
		id: z.string().describe("Unique product identifier"),
		name: z.string().describe("Product name"),
		price: z.number().min(0).describe("Product price in USD"),
		categories: z.array(z.string()).describe("Product categories"),
		specifications: z
			.object({
				weight: z.number().describe("Product weight in grams"),
				dimensions: z
					.object({
						width: z.number(),
						height: z.number(),
						depth: z.number(),
					})
					.describe("Product dimensions in centimeters"),
			})
			.describe("Product specifications and measurements"),
		tags: z
			.array(z.enum(["new", "featured", "sale", "limited"]))
			.describe("Product tags"),
	})
	.describe("Product schema with nested objects, arrays, and enums");

// Convert Zod schemas to JSON Schema
const userJsonSchema = z.toJSONSchema(userSchema);
const apiResponseJsonSchema = z.toJSONSchema(apiResponseSchema);
const productJsonSchema = z.toJSONSchema(productSchema);

export default function JsonSchemaViewerPlayground() {
	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="space-y-4">
				<h1 className="text-3xl font-bold">
					JSON Schema Viewer Playground
				</h1>
				<p className="text-muted-foreground text-lg">
					A read-only component for displaying JSON Schema structures
					with support for union types, nested objects, arrays, and
					enums.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">
						User Profile Schema
					</h2>
					<p className="text-sm text-muted-foreground">
						Basic schema with various field types including enums
						and validation rules.
					</p>
					<div className="text-xs text-muted-foreground bg-muted p-3 rounded mb-4 font-mono">
						<strong>Zod Schema:</strong>
						<br />
						z.object(&#123;
						<br />
						&nbsp;&nbsp;name: z.string().describe("The user's full
						name"),
						<br />
						&nbsp;&nbsp;email: z.string().email().describe("The
						user's email address"),
						<br />
						&nbsp;&nbsp;age:
						z.number().int().min(0).max(150).describe("The user's
						age in years"),
						<br />
						&nbsp;&nbsp;isActive: z.boolean().describe("Whether the
						user account is active"),
						<br />
						&nbsp;&nbsp;role: z.enum(["admin", "user",
						"moderator"]).describe("The user's role in the system"),
						<br />
						&#125;).describe("A user profile schema with various
						field types")
					</div>
					<JsonSchemaViewer schema={userJsonSchema} />
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold">
						API Response Schema
					</h2>
					<p className="text-sm text-muted-foreground">
						Union type schema showing success/error response
						structures.
					</p>
					<div className="text-xs text-muted-foreground bg-muted p-3 rounded mb-4 font-mono">
						<strong>Zod Schema:</strong>
						<br />
						z.union([
						<br />
						&nbsp;&nbsp;z.object(&#123;success: z.literal(true),
						data: z.object(&#123;...&#125;)&#125;),
						<br />
						&nbsp;&nbsp;z.object(&#123;success: z.literal(false),
						error: z.object(&#123;...&#125;)&#125;),
						<br />
						])
					</div>
					<JsonSchemaViewer schema={apiResponseJsonSchema} />
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Product Schema (Full)</h2>
				<p className="text-sm text-muted-foreground">
					Complex schema with nested objects, arrays, and enums
					showing full detail.
				</p>
				<div className="text-xs text-muted-foreground bg-muted p-3 rounded mb-4 font-mono overflow-x-auto">
					<strong>Zod Schema:</strong>
					<br />
					z.object(&#123;
					<br />
					&nbsp;&nbsp;id: z.string().describe("Unique product
					identifier"),
					<br />
					&nbsp;&nbsp;name: z.string().describe("Product name"),
					<br />
					&nbsp;&nbsp;price: z.number().min(0).describe("Product price
					in USD"),
					<br />
					&nbsp;&nbsp;categories:
					z.array(z.string()).describe("Product categories"),
					<br />
					&nbsp;&nbsp;specifications: z.object(&#123;
					<br />
					&nbsp;&nbsp;&nbsp;&nbsp;weight: z.number().describe("Product
					weight in grams"),
					<br />
					&nbsp;&nbsp;&nbsp;&nbsp;dimensions: z.object(&#123;width,
					height, depth&#125;).describe("Product dimensions in
					centimeters"),
					<br />
					&nbsp;&nbsp;&#125;).describe("Product specifications and
					measurements"),
					<br />
					&nbsp;&nbsp;tags: z.array(z.enum(["new", "featured", "sale",
					"limited"])).describe("Product tags"),
					<br />
					&#125;).describe("Product schema with nested objects,
					arrays, and enums")
				</div>
				<JsonSchemaViewer
					schema={productJsonSchema}
					title="Product Information Schema"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Usage Example</h2>
				<div className="bg-muted p-4 rounded-lg">
					<pre className="text-sm overflow-x-auto">
						{`import { z } from "zod";
import { JsonSchemaViewer } from "@/registry/ui/json-schema-viewer";

const mySchema = z.object({
  name: z.string().describe("User name"),
  age: z.number().min(0).describe("Age in years"),
});

const jsonSchema = z.toJSONSchema(mySchema);

function MyComponent() {
  return <JsonSchemaViewer schema={jsonSchema} />;
}`}
					</pre>
				</div>
			</div>
		</div>
	);
}
