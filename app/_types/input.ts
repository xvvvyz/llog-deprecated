import { Database } from '@/_types/database';

export interface InputSettingsType {
  isCreatable?: boolean;
  max?: string;
  maxFractionDigits?: string;
  min?: string;
  minFractionDigits?: string;
}

export type InputType = Database['public']['Tables']['inputs']['Row'] & {
  settings?: InputSettingsType | null;
};
