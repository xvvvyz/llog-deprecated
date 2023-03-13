import { Database } from '(types)/database';
import createServerSupabaseClient from './create-server-supabase-client';

const getInputWithoutIds = (inputId: string) =>
  createServerSupabaseClient()
    .from('inputs')
    .select(
      `
      label,
      options:input_options(label),
      settings,
      subjects_for:input_subjects(subject_id),
      type`
    )
    .eq('id', inputId)
    .eq('options.deleted', false)
    .order('order', { foreignTable: 'options' })
    .single();

export type GetInputWithoutIdsData = Awaited<
  ReturnType<typeof getInputWithoutIds>
>['data'] & {
  options: Pick<Database['public']['Tables']['input_options']['Row'], 'label'>;
  subjects_for: Pick<
    Database['public']['Tables']['input_subjects']['Row'],
    'subject_id'
  >;
};

export default getInputWithoutIds;
