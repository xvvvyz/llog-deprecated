'use server';

import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const setActiveTeam = async (teamId: string) => {
  const supabase = await createServerSupabaseClient();

  const [{ data: team }, user] = await Promise.all([
    supabase.from('teams').select('id').eq('id', teamId).single(),
    getCurrentUser(),
  ]);

  if (!team || !user) return;

  const supabaseService = await createServerSupabaseClient({
    apiKey: process.env.SUPABASE_SERVICE_KEY!,
  });

  await supabaseService.auth.admin.updateUserById(user.id, {
    app_metadata: { active_team_id: team.id },
  });

  revalidatePath('/', 'layout');
};

export default setActiveTeam;
