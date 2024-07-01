import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const countArchivedSubjects = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('*', { count: 'exact', head: true })
    .eq('archived', true)
    .eq('deleted', false);

export default countArchivedSubjects;
