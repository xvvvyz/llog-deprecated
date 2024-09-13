export type ProtocolTemplateDataJson = {
  sessions: Array<{
    modules: Array<{
      content?: string;
      inputIds?: string[];
      name?: string;
    }>;
    title?: string;
  }>;
} | null;
