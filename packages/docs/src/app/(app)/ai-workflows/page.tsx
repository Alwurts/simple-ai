import { BlockDisplay } from "@/components/blocks/block-display";

export const dynamic = "force-static";
export const revalidate = false;

export default async function WorkflowsPage() {
	return (
		<div className="container-wrapper flex-1">
			<div className="container py-8 first:pt-6 last:border-b-0 xl:py-12">
				<BlockDisplay name={"workflow-01"} />
			</div>
		</div>
	);
}
