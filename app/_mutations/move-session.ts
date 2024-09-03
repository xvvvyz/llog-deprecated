'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const moveSession = async ({
  currentOrder,
  isDraft,
  newOrder,
  sessionId,
  trainingPlanId,
}: {
  currentOrder: number;
  isDraft: boolean;
  newOrder: number;
  sessionId: string;
  trainingPlanId: string;
}) => {
  const supabase = createServerSupabaseClient();
  const update = [
    { id: sessionId, order: newOrder, training_plan_id: trainingPlanId },
  ];

  if (!isDraft) {
    const { data: swapWith } = await supabase
      .from('sessions')
      .select('id')
      .eq('training_plan_id', trainingPlanId)
      .eq('"order"', newOrder)
      .eq('draft', false)
      .single();

    if (swapWith) {
      update.push({
        id: swapWith.id,
        order: currentOrder,
        training_plan_id: trainingPlanId,
      });
    }
  }

  await supabase.from('sessions').upsert(update);
  revalidatePath('/', 'layout');
};

export default moveSession;
