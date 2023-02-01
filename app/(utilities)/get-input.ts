import createServerSupabaseClient from './create-server-supabase-client';

const getInput = (inputId: string) =>
  createServerSupabaseClient()
    .from('inputs')
    .select('id, label, options:input_options(id, label), type')
    .eq('id', inputId)
    .order('order', { foreignTable: 'input_options' })
    .single();

export type GetInputData = Awaited<ReturnType<typeof getInput>>['data'];
export default getInput;
