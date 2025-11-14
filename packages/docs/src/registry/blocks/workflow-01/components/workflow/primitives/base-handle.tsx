import { Handle } from "@xyflow/react";
import type { ComponentProps } from "react";

export function BaseHandle({ ...props }: ComponentProps<typeof Handle>) {
	return <Handle {...props} />;
}
