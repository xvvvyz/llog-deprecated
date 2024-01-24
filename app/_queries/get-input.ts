import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

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
      type`,
    )
    .eq('id', inputId)
    .order('order', { referencedTable: 'options' })
    .single();

export type GetInputData = Awaited<ReturnType<typeof getInput>>['data'];

export default getInput;
