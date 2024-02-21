'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';

const upsertMission = async (
  context: { missionId?: string; next: string; subjectId: string },
  _state: { error: string } | null,
  data: FormData,
) => {
  const supabase = createServerSupabaseClient();

  const { data: mission, error } = await supabase
    .from('missions')
    .upsert({
      id: context.missionId,
      name: data.get('name') as string,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');

  redirect(
    context.missionId
      ? context.next
      : `/subjects/${context.subjectId}/training-plans/${mission.id}/sessions?back=${context.next}`,
    context.next ? RedirectType.push : RedirectType.replace,
  );
};

export default upsertMission;
