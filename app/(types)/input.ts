import { Database } from './database';

export interface InputSettingsType {
  isCreatable?: string;
}

export type InputType = Database['public']['Tables']['inputs']['Row'] & {
  settings?: InputSettingsType;
};
