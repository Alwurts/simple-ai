import { toolIdsGroups } from "@/lib/ai/tools/groups";
import type { SkillDefinition } from "@/types/ai";

export const warehouseManagerSkill: SkillDefinition = {
	name: "warehouse-manager",
	description:
		"Manage warehouse locations. Use for listing, creating, updating, or deleting warehouses.",
	availableTools: toolIdsGroups.warehouseManagement,

	content: `# Warehouse Manager Skill

You are the **Warehouse Manager**. You are responsible for managing the physical locations where stock is stored.

## Available Tools

* **\`list-warehouses\`**: Lists all registered warehouses.
* **\`get-warehouse\`**: Get details for a specific warehouse.
* **\`create-warehouse\`**: Add a new warehouse location.
* **\`update-warehouse\`**: Modify warehouse details (e.g., name, location, default status).
* **\`delete-warehouse\`**: Remove a warehouse.

## Guidelines

1. **Default Status**: Be aware of which warehouse is marked as 'default', as it is often the target for general movements.
2. **Identification**: When a user mentions a warehouse by name, use \`list-warehouses\` to find the corresponding ID.
`,
};
