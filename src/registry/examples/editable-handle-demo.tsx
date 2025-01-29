"use client";

import "@xyflow/react/dist/style.css";

import {
	Background,
	type Connection,
	type EdgeChange,
	type Node,
	type NodeChange,
	type NodeProps,
	type NodeTypes,
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	useUpdateNodeInternals,
} from "@xyflow/react";

import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { Position } from "@xyflow/react";
import {
	EditableHandle,
	EditableHandleDialog,
} from "@/registry/ui/flow/editable-handle";
import { Button } from "@/components/ui/button";

const DynamicHandlesNode = ({ id }: NodeProps<Node>) => {
	const updateNodeInternals = useUpdateNodeInternals();
	const [handles, setHandles] = useState<
		{ id: string; name: string; description?: string }[]
	>([
		{
			id: "1",
			name: "input1",
			description: "Input 1 description",
		},
	]);

	const handleCreate = useCallback(
		(name: string, description?: string) => {
			console.log("New handle", name, description);
			const newHandle = {
				id: `handle-${nanoid()}`,
				name,
				description,
			};
			setHandles((prev) => [...prev, newHandle]);
			updateNodeInternals(id);
			return true;
		},
		[id, updateNodeInternals],
	);

	const handleUpdate = useCallback(
		(handleId: string, newName: string, newDescription?: string) => {
			setHandles((prev) =>
				prev.map((handle) =>
					handle.id === handleId
						? { ...handle, name: newName, description: newDescription }
						: handle,
				),
			);
			return true;
		},
		[],
	);

	const handleDelete = useCallback(
		(handleId: string) => {
			setHandles((prev) => prev.filter((handle) => handle.id !== handleId));
			updateNodeInternals(id);
		},
		[id, updateNodeInternals],
	);

	return (
		<div className="py-4 border rounded-lg bg-background w-[300px]">
			<h2 className="text-lg font-semibold mb-4 px-4">Node with dynamic Handles</h2>

			<EditableHandleDialog
				variant="create"
				label=""
				onSave={handleCreate}
				onCancel={() => {}}
				align="start"
			>
				<Button variant="outline" size="sm" className="h-8 ml-4">
					Create New Handle
				</Button>
			</EditableHandleDialog>

			<div className="mt-4 space-y-2">
				{handles.map((handle) => (
					<div key={handle.id} className="flex items-center gap-2">
						<EditableHandle
							nodeId={id}
							handleId={handle.id}
							name={handle.name}
							description={handle.description}
							type="target"
							position={Position.Left}
							wrapperClassName="w-full"
							onUpdateTool={handleUpdate}
							onDelete={handleDelete}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const nodeTypes: NodeTypes = {
	"editable-handle-node": DynamicHandlesNode,
};

const initialNodes = [
	{
		id: "node-1",
		type: "editable-handle-node",
		position: { x: 0, y: 0 },
		data: {},
	},
];

export default function EditableHandleDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	const defaultViewport = { x: 100, y: 150, zoom: 1.1 };

	const onNodesChange = useCallback(
		(changes: NodeChange<Node>[]) =>
			setNodes((nds) => applyNodeChanges(changes, nds)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange<never>[]) =>
			setEdges((eds) => applyEdgeChanges(changes, eds)),
		[],
	);
	const onConnect = useCallback(
		(connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
		[],
	);

	return (
		<div className="w-[600px] h-[600px] border border-border rounded-md">
			<ReactFlowProvider>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					defaultViewport={defaultViewport}
				>
					<Background />
				</ReactFlow>
			</ReactFlowProvider>
		</div>
	);
}
