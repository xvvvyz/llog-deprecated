import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInputs = async () =>
  (await createServerSupabaseClient())
    .from('inputs')
    .select('id, label, subjects!input_subjects(id, image_uri, name), type')
    .eq('team_id', (await getCurrentUser())?.app_metadata?.active_team_id ?? '')
    .eq('archived', false)
    .eq('subjects.deleted', false)
    .not('subjects.archived', 'is', null)
    .order('name', { referencedTable: 'subjects' })
    .order('label');

export type ListInputsData = Awaited<ReturnType<typeof listInputs>>['data'];

export default listInputs;
