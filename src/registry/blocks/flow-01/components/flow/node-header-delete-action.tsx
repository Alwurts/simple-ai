import { NodeHeaderAction } from "@/components/flow/node-header";

import { Trash } from "lucide-react";
import { useCallback } from "react";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";

export function NodeHeaderDeleteAction({ id }: { id: string }) {
	const deleteNode = useStore((state) => state.deleteNode);
	const handleClick = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<NodeHeaderAction onClick={handleClick} variant="ghost" label="Delete node">
			<Trash />
		</NodeHeaderAction>
	);
}
