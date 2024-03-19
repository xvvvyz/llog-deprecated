'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteSession = async ({
  currentOrder,
  missionId,
  sessionId,
}: {
  currentOrder: number;
  missionId: string;
  sessionId: string;
}) => {
  const supabase = createServerSupabaseClient();

  const { data: shiftSessions } = await supabase
    .from('sessions')
    .select('id, order')
    .eq('mission_id', missionId)
    .gt('"order"', currentOrder)
    .eq('draft', false);

  if (shiftSessions?.length) {
    await supabase.from('sessions').upsert(
      shiftSessions.map((session) => ({
        id: session.id,
        mission_id: missionId,
        order: session.order - 1,
      })),
    );
  }

  await supabase.from('sessions').delete().eq('id', sessionId);
  revalidatePath('/', 'layout');
};

export default deleteSession;
