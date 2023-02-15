import createServerSupabaseClient from './create-server-supabase-client';

const getInput = (inputId: string) =>
  createServerSupabaseClient()
    .from('inputs')
    .select('id, label, options:input_options(id, label), settings, type')
    .eq('id', inputId)
    .eq('options.deleted', false)
    .order('order', { foreignTable: 'options' })
    .single();

export type GetInputData = Awaited<ReturnType<typeof getInput>>['data'];
export default getInput;
