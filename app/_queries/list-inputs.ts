import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInputs = async () =>
  createServerSupabaseClient()
    .from('inputs')
    .select('id, label, subjects(id, image_uri, name), type')
    .eq('team_id', (await getCurrentUserFromSession())?.id ?? '')
    .eq('archived', false)
    .eq('subjects.deleted', false)
    .order('name', { referencedTable: 'subjects' })
    .order('label');

export type ListInputsData = Awaited<ReturnType<typeof listInputs>>['data'];

export default listInputs;
