import { CornerDownLeft, Loader2, Package, Warehouse } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSearch } from "@/hooks/query/use-search";
import type { SearchResult } from "@/types/search";

interface SearchCommandProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
	const router = useRouter();
	const [query, setQuery] = React.useState("");
	const [debouncedQuery, setDebouncedQuery] = React.useState("");

	const debouncedSetQuery = useDebouncedCallback((value: string) => {
		setDebouncedQuery(value);
	}, 300);

	const { data, isLoading } = useSearch(debouncedQuery);
	const results = data?.results || [];

	// Group results by type
	const groupedResults = React.useMemo(() => {
		const groups: Record<string, SearchResult[]> = {};
		results.forEach((result) => {
			const groupName = result.metadata.type === "product" ? "Products" : "Warehouses";

			if (!groups[groupName]) {
				groups[groupName] = [];
			}
			groups[groupName].push(result);
		});
		return groups;
	}, [results]);

	React.useEffect(() => {
		debouncedSetQuery(query);
	}, [query, debouncedSetQuery]);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				e.preventDefault();
				setOpen(!open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, setOpen]);

	const handleSelect = React.useCallback(
		(result: SearchResult) => {
			setOpen(false);
			const meta = result.metadata;

			// Type-Safe Routing based on Discriminator
			switch (meta.type) {
				case "product":
					router.push(`/inventory/products/${meta.id}`);
					break;

				case "warehouse":
					router.push(`/inventory/warehouses`);
					break;
			}
		},
		[router, setOpen],
	);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<DialogTitle className="sr-only">Global Search</DialogTitle>
			<DialogDescription className="sr-only">
				Search across products and warehouses
			</DialogDescription>

			<div className="flex items-center border-b px-3">
				<CommandInput
					placeholder="Search products and warehouses..."
					value={query}
					onValueChange={setQuery}
					className="border-none focus:ring-0"
				/>
				{isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
			</div>

			<CommandList className="max-h-[500px] pb-2">
				<CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
					{query.length === 0 ? "Type to search..." : "No results found."}
				</CommandEmpty>

				{results.length > 0 &&
					Object.entries(groupedResults).map(([groupName, groupItems]) => (
						<CommandGroup key={groupName} heading={groupName}>
							{groupItems.map((result) => (
								<ResultItem
									key={result.path + result.metadata.id}
									result={result}
									onSelect={handleSelect}
								/>
							))}
						</CommandGroup>
					))}
			</CommandList>

			{/* Footer */}
			<div className="flex h-10 items-center justify-between border-t bg-muted/20 px-3 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<span className="flex items-center gap-1">
						<CornerDownLeft className="h-3 w-3" /> Open
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span>Search powered by PostgreSQL</span>
				</div>
			</div>
		</CommandDialog>
	);
}

function ResultItem({
	result,
	onSelect,
}: {
	result: SearchResult;
	onSelect: (r: SearchResult) => void;
}) {
	const meta = result.metadata;

	// Visual Configuration based on type
	const getConfig = () => {
		switch (meta.type) {
			case "product":
				return {
					icon: Package,
					badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
					label: "Product",
				};
			case "warehouse":
				return {
					icon: Warehouse,
					badgeColor: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
					label: "Warehouse",
				};
			default:
				return {
					icon: Package,
					badgeColor: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
					label: "Unknown",
				};
		}
	};

	const config = getConfig();
	const Icon = config.icon;

	return (
		<CommandItem
			value={result.metadata.title + result.snippet}
			onSelect={() => onSelect(result)}
			className="flex items-start gap-3 rounded-lg px-3 py-3 aria-selected:bg-accent"
		>
			<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
				<Icon className="h-4 w-4" />
			</div>

			<div className="flex flex-1 flex-col gap-1 overflow-hidden">
				<div className="flex items-center gap-2">
					<span className="font-medium truncate flex-1">{result.metadata.title}</span>
					<Badge
						variant="outline"
						className={`h-5 px-2 text-[10px] font-medium ${config.badgeColor}`}
					>
						{config.label}
					</Badge>
				</div>

				<p className="line-clamp-2 text-sm text-muted-foreground">{result.snippet}</p>

				<div className="flex items-center gap-2 text-xs text-muted-foreground/70">
					<span className="truncate max-w-[200px] font-mono">{result.path}</span>
					{meta.type === "product" && (
						<>
							<span>•</span>
							<span>SKU: {meta.sku}</span>
						</>
					)}
				</div>
			</div>
		</CommandItem>
	);
}
