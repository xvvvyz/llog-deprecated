import createServerComponentClient from '@/_server/create-server-component-client';
import { Database } from '@/_types/database';

const getInputWithoutIds = (inputId: string) =>
  createServerComponentClient()
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
