'use server';

import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const createTag = async ({ name }: { name: string }) => {
  const supabase = await createServerSupabaseClient();
  const user = await getCurrentUser();

  return supabase
    .from('tags')
    .insert({ name, team_id: user?.app_metadata?.active_team_id })
    .select('id')
    .single();
};

export default createTag;
