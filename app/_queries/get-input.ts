import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getInput = async (inputId: string) =>
  (await createServerSupabaseClient())
    .from('inputs')
    .select(
      `
      id,
      label,
      options:input_options(id, label),
      settings,
      subjects(id),
      type`,
    )
    .eq('id', inputId)
    .eq('subjects.deleted', false)
    .not('subjects.archived', 'is', null)
    .order('order', { referencedTable: 'options' })
    .single();

export type GetInputData = Awaited<ReturnType<typeof getInput>>['data'];

export default getInput;
