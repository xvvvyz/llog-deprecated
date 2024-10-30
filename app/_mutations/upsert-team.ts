'use server';

import { TeamFormValues } from '@/_components/team-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertTeam = async (
  context: { teamId?: string },
  data: Omit<TeamFormValues, 'avatar'>,
) => {
  const res = await (
    await createServerSupabaseClient()
  ).rpc('upsert_team', {
    _id: context.teamId,
    _name: data.name.trim(),
  });

  if (res.error) return { error: res.error.message };
  if (context.teamId) revalidatePath('/', 'layout');
  return { data: { id: res.data } };
};

export default upsertTeam;
