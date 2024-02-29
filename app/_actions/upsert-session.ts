'use server';

import { SessionFormValues } from '@/_components/session-form';
import { Database } from '@/_types/database';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';

const upsertSession = async (
  context: {
    currentOrder: number;
    missionId: string;
    publishedOrder: number;
    sessionId?: string;
    subjectId: string;
  },
  data: SessionFormValues,
) => {
  const supabase = createServerSupabaseClient();
  const finalOrder = data.draft ? context.currentOrder : context.publishedOrder;
  let wasDraft = !context.sessionId;

  if (context.sessionId) {
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('draft')
      .eq('id', context.sessionId)
      .single();

    if (existingSession) wasDraft = existingSession.draft;
  }

  if (wasDraft && !data.draft) {
    const { data: shiftSessions } = await supabase
      .from('sessions')
      .select('id, order')
      .eq('mission_id', context.missionId)
      .gte('"order"', finalOrder)
      .eq('draft', false);

    if (shiftSessions?.length) {
      await supabase.from('sessions').upsert(
        shiftSessions.map((session) => ({
          id: session.id,
          mission_id: context.missionId,
          order: session.order + 1,
        })),
      );
    }
  }

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .upsert({
      draft: data.draft,
      id: context.sessionId,
      mission_id: context.missionId,
      order: finalOrder,
      scheduled_for: data.scheduledFor || null,
      title: data.title?.trim() || null,
    })
    .select('id')
    .single();

  if (sessionError) return { error: sessionError.message };

  const { insertEventTypes, updateEventTypeIds, updateEventTypes } =
    data.modules.reduce<{
      insertEventTypes: Array<
        Database['public']['Tables']['event_types']['Insert']
      >;
      updateEventTypeIds: string[];
      updateEventTypes: Array<
        Database['public']['Tables']['event_types']['Insert']
      >;
    }>(
      (acc, module, order) => {
        const payload: Database['public']['Tables']['event_types']['Insert'] = {
          content: sanitizeHtml(module.content),
          order,
          session_id: session.id,
          subject_id: context.subjectId,
        };

        if (module.id) {
          payload.id = module.id;
          acc.updateEventTypes.push(payload);
          acc.updateEventTypeIds.push(module.id);
        } else {
          acc.insertEventTypes.push(payload);
        }

        return acc;
      },
      { insertEventTypes: [], updateEventTypeIds: [], updateEventTypes: [] },
    );

  await supabase
    .from('event_types')
    .delete()
    .eq('session_id', session.id)
    .not('id', 'in', `(${updateEventTypeIds.join(',')})`);

  if (updateEventTypes.length) {
    const { error } = await supabase
      .from('event_types')
      .upsert(updateEventTypes);

    if (error) {
      if (!context.sessionId) {
        await supabase.from('sessions').delete().eq('id', session.id);
      }

      return { error: error.message };
    }
  }

  if (insertEventTypes.length) {
    const { data: insertedEventTypes, error } = await supabase
      .from('event_types')
      .upsert(insertEventTypes)
      .select('id');

    if (error) {
      if (!context.sessionId) {
        await supabase.from('sessions').delete().eq('id', session.id);
      }

      return { error: error.message };
    }

    const insertEventTypesDataReverse = insertedEventTypes.reverse();

    data.modules = data.modules.map((module) => {
      if (module.id) return module;
      const id = insertEventTypesDataReverse.pop()?.id;
      if (!id) return module;
      module.id = id;
      return module;
    });
  }

  const { deleteEventTypeInputs, insertEventTypeInputs } = data.modules.reduce<{
    deleteEventTypeInputs: string[];
    insertEventTypeInputs: Array<
      Database['public']['Tables']['event_type_inputs']['Insert']
    >;
  }>(
    (acc, module) => {
      acc.deleteEventTypeInputs.push(module.id!);

      module.inputs.forEach((input, order) => {
        acc.insertEventTypeInputs.push({
          event_type_id: module.id!,
          input_id: input.id,
          order,
        });
      });

      return acc;
    },
    {
      deleteEventTypeInputs: [],
      insertEventTypeInputs: [],
    },
  );

  if (deleteEventTypeInputs.length) {
    await supabase
      .from('event_type_inputs')
      .delete()
      .in('event_type_id', deleteEventTypeInputs);
  }

  if (insertEventTypeInputs.length) {
    const { error } = await supabase
      .from('event_type_inputs')
      .insert(insertEventTypeInputs);

    if (error) {
      if (!context.sessionId) {
        await supabase.from('sessions').delete().eq('id', session.id);
      }

      return { error: error.message };
    }
  }
};

export default upsertSession;
