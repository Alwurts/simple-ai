import * as React from "react";
import JsxParser from "react-jsx-parser";
import { completeJsxTag } from "@/registry/lib/jsx-utils";

interface JsxRendererProps extends React.HTMLAttributes<HTMLDivElement> {
	jsx: string;
	fixIncompleteJsx?: boolean;
	components: Record<string, React.ComponentType>;
}

const JsxRenderer = React.forwardRef<JsxParser, JsxRendererProps>(
	({ className, jsx, fixIncompleteJsx = true, components }, ref) => {
		const processedJsx = React.useMemo(() => {
			return fixIncompleteJsx ? completeJsxTag(jsx) : jsx;
		}, [jsx, fixIncompleteJsx]);

		return (
			<JsxParser
				ref={ref}
				className={className}
				jsx={processedJsx}
				components={components}
			/>
		);
	},
);
JsxRenderer.displayName = "JsxRenderer";

export { JsxRenderer };
