'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteSession = async ({
  currentOrder,
  sessionId,
  trainingPlanId,
}: {
  currentOrder: number;
  sessionId: string;
  trainingPlanId: string;
}) => {
  const supabase = createServerSupabaseClient();

  const { data: deleteSession } = await supabase
    .from('sessions')
    .select('draft')
    .eq('id', sessionId)
    .single();

  if (!deleteSession?.draft) {
    const { data: shiftSessions } = await supabase
      .from('sessions')
      .select('id, order')
      .eq('training_plan_id', trainingPlanId)
      .gt('"order"', currentOrder)
      .eq('draft', false);

    if (shiftSessions?.length) {
      await supabase.from('sessions').upsert(
        shiftSessions.map((session) => ({
          id: session.id,
          order: session.order - 1,
          training_plan_id: trainingPlanId,
        })),
      );
    }
  }

  await supabase.from('sessions').delete().eq('id', sessionId);
  revalidatePath('/', 'layout');
};

export default deleteSession;
