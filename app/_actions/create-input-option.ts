'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const createInputOption = async ({
  inputId,
  label,
}: {
  inputId: string;
  label: string;
}) => {
  const supabase = createServerSupabaseClient();

  const { count, error: countError } = await supabase
    .from('input_options')
    .select('*', { count: 'exact', head: true })
    .eq('input_id', inputId);

  if (countError) return { error: countError.message };

  const { data, error } = await supabase
    .from('input_options')
    .insert({ input_id: inputId, label, order: count ?? 0 })
    .select('id, label')
    .single();

  if (error) return { error: error.message };
  return { data };
};

export default createInputOption;
