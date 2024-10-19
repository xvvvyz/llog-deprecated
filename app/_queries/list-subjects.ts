'use server';

import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjects = async () => {
  const supabase = await createServerSupabaseClient();
  const user = await getCurrentUser();
  const userId = user?.id ?? '';

  const { data: clientSubjectIds } = await supabase
    .from('subject_clients')
    .select('subject_id')
    .eq('profile_id', userId);

  const formattedIds = (clientSubjectIds ?? [])
    .map((subjectClient) => subjectClient.subject_id)
    .join(',');

  return supabase
    .from('subjects')
    .select('archived, id, image_uri, name, public, share_code, team_id')
    .or(
      `team_id.eq.${user?.app_metadata.active_team_id}, id.in.(${formattedIds})`,
    )
    .eq('deleted', false);
};

export type ListSubjectsData = Awaited<ReturnType<typeof listSubjects>>['data'];

export default listSubjects;
