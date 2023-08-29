import { Database } from '@/_types/database';

export interface TemplateDataType {
  content: string;
  inputIds: string[];
}

export type TemplateType = Database['public']['Tables']['templates']['Row'] & {
  data: TemplateDataType;
};
