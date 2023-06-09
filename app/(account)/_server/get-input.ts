import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getInput = (inputId: string) =>
  createServerComponentClient()
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
