import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInputsWithUses = async () =>
  (await createServerSupabaseClient())
    .from('inputs')
    .select(
      `
      id,
      label,
      subjects!input_subjects(id, image_uri, name),
      type,
      uses:event_types(subject:subjects(id, name))`,
    )
    .eq('team_id', (await getCurrentUser())?.app_metadata?.active_team_id ?? '')
    .eq('archived', false)
    .eq('subjects.deleted', false)
    .not('subjects.archived', 'is', null)
    .eq('event_types.subjects.deleted', false)
    .order('name', { referencedTable: 'subjects' })
    .order('label');

export type ListInputsWithUsesData = Awaited<
  ReturnType<typeof listInputsWithUses>
>['data'];

export default listInputsWithUses;
