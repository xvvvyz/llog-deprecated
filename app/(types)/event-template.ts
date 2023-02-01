import { Database } from './database';

export interface EventTemplateData {
  content: string;
  inputIds: string[];
}

export type EventTemplate = Database['public']['Tables']['templates']['Row'] & {
  data: EventTemplateData;
};
