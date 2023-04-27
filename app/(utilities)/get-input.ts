import { Database } from '(types)/database';
import createServerSupabaseClient from './create-server-supabase-client';

const getInput = (inputId: string) =>
  createServerSupabaseClient()
    .from('inputs')
    .select(
      `
      id,
      label,
      options:input_options(id, label),
      settings,
      subjects_for:input_subjects(subject_id),
      type`
    )
    .eq('id', inputId)
    .eq('options.deleted', false)
    .order('order', { foreignTable: 'options' })
    .single();

export type GetInputData = Awaited<ReturnType<typeof getInput>>['data'] & {
  options: Pick<
    Database['public']['Tables']['input_options']['Row'],
    'id' | 'label'
  >;
  subjects_for: Pick<
    Database['public']['Tables']['input_subjects']['Row'],
    'subject_id'
  >;
};

export default getInput;
