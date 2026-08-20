import type { LanguageModelUsage } from "ai";

export type AIMetadata = {
  createdAt: string;
  status: "pending" | "success" | "error";
  modelId?: string;
  usage?: LanguageModelUsage;
  responseTime?: number;
  summaryText?: string;
};

export type AIDataPart = {
  plan: {
    entries: Array<{
      content: string;
      status?: "completed" | "pending";
    }>;
  };
};
