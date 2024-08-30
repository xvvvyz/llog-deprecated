import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getInputWithUses = (inputId: string) =>
  createServerSupabaseClient()
    .from('inputs')
    .select(
      `
      id,
      label,
      options:input_options(id, label),
      settings,
      subjects(id),
      type,
      uses:event_types(subject:subjects(id, name, image_uri))`,
    )
    .eq('id', inputId)
    .eq('subjects.deleted', false)
    .not('subjects.archived', 'is', null)
    .eq('event_types.subjects.deleted', false)
    .order('order', { referencedTable: 'options' })
    .single();

export type GetInputWithUsesData = Awaited<
  ReturnType<typeof getInputWithUses>
>['data'];

export default getInputWithUses;
