export type SessionTemplateDataJson = {
  modules: Array<{
    content?: string;
    inputIds?: string[];
    name?: string;
  }>;
} | null;
