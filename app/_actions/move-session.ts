'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const moveSession = async ({
  currentOrder,
  isDraft,
  missionId,
  newOrder,
  sessionId,
}: {
  currentOrder: number;
  isDraft: boolean;
  missionId: string;
  newOrder: number;
  sessionId: string;
}) => {
  const supabase = createServerSupabaseClient();
  const update = [{ id: sessionId, mission_id: missionId, order: newOrder }];

  if (!isDraft) {
    const { data: swapWith } = await supabase
      .from('sessions')
      .select('id')
      .eq('mission_id', missionId)
      .eq('"order"', newOrder)
      .eq('draft', false)
      .single();

    if (swapWith) {
      update.push({
        id: swapWith.id,
        mission_id: missionId,
        order: currentOrder,
      });
    }
  }

  await supabase.from('sessions').upsert(update);
  revalidatePath('/', 'layout');
};

export default moveSession;
