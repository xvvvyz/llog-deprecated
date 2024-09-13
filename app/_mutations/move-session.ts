'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const moveSession = async ({
  currentOrder,
  isDraft,
  newOrder,
  sessionId,
  protocolId,
}: {
  currentOrder: number;
  isDraft: boolean;
  newOrder: number;
  sessionId: string;
  protocolId: string;
}) => {
  const supabase = createServerSupabaseClient();
  const update = [{ id: sessionId, order: newOrder, protocol_id: protocolId }];

  if (!isDraft) {
    const { data: swapWith } = await supabase
      .from('sessions')
      .select('id')
      .eq('protocol_id', protocolId)
      .eq('"order"', newOrder)
      .eq('draft', false)
      .single();

    if (swapWith) {
      update.push({
        id: swapWith.id,
        order: currentOrder,
        protocol_id: protocolId,
      });
    }
  }

  await supabase.from('sessions').upsert(update);
  revalidatePath('/', 'layout');
};

export default moveSession;
