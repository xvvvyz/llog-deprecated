import { Database } from './database';

export interface TemplateDataType {
  content: string;
  inputIds: string[];
}

export type TemplateType = Database['public']['Tables']['templates']['Row'] & {
  data: TemplateDataType;
};
