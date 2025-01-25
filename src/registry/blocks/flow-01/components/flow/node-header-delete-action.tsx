import { NodeHeaderAction } from "@/components/flow/node-header";

import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import { Trash } from "lucide-react";
import { useCallback } from "react";

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
