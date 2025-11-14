import type { WorkflowDefinition } from "@/registry/lib/flow/workflow";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";

export interface SSEWorkflowExecutionEventHandlers {
	onNodeUpdate: (nodeId: string, state: NodeExecutionState) => void;
	onError: (error: Error, nodeId?: string) => void;
	onComplete: ({ timestamp }: { timestamp: string }) => void;
}

export class SSEWorkflowExecutionClient {
	private abortController: AbortController | null = null;
	private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

	async connect(
		workflow: WorkflowDefinition,
		handlers: SSEWorkflowExecutionEventHandlers,
	): Promise<void> {
		try {
			this.abortController = new AbortController();

			const response = await fetch("/api/flow/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "text/event-stream",
				},
				body: JSON.stringify({ workflow }),
				signal: this.abortController.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				throw new Error("Response body is null");
			}

			this.reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const { done, value } = await this.reader.read();
				if (done) {
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						try {
							const data = JSON.parse(line.slice(6));

							switch (data.type) {
								case "nodeUpdate": {
									handlers.onNodeUpdate(data.nodeId, data.executionState);
									break;
								}
								case "error": {
									handlers.onError(new Error(data.error));
									break;
								}
								case "complete": {
									handlers.onComplete({
										timestamp: data.timestamp,
									});
									this.disconnect();
									break;
								}
							}
						} catch (error) {
							console.error("Error parsing SSE data:", error);
						}
					}
				}
			}
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				// Ignore abort errors as they are expected when disconnecting
				return;
			}
			handlers.onError(
				error instanceof Error ? error : new Error("SSE connection failed"),
			);
		} finally {
			this.disconnect();
		}
	}

	disconnect(): void {
		if (this.reader) {
			this.reader.cancel();
			this.reader = null;
		}
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
	}
}
