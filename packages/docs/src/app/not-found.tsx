import { Separator } from "@/components/ui/separator";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen text-xl">
			<div className="flex items-center gap-4">
				<span className="text-center">Not Found</span>
				<Separator orientation="vertical" className="h-10" />
				<span className="text-2xl"> 404</span>
			</div>
		</div>
	);
}
