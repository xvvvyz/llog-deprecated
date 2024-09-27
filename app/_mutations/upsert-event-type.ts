'use server';

import { EventTypeFormValues } from '@/_components/event-type-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const upsertEventType = async (
  context: { eventTypeId?: string; subjectId: string },
  data: EventTypeFormValues,
) => {
  const supabase = await createServerSupabaseClient();

  const { data: eventType, error } = await supabase
    .from('event_types')
    .upsert({
      content: sanitizeHtml(data.content) || null,
      id: context.eventTypeId,
      name: data.name?.trim() || null,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  if (context.eventTypeId) {
    await supabase
      .from('event_type_inputs')
      .delete()
      .eq('event_type_id', context.eventTypeId);
  }

  if (data.inputs?.length) {
    const { error } = await supabase.from('event_type_inputs').insert(
      data.inputs.map((input, order) => ({
        event_type_id: eventType.id,
        input_id: input.id,
        order,
      })),
    );

    if (error) {
      if (!context.eventTypeId) {
        await supabase.from('event_types').delete().eq('id', eventType.id);
      }

      return { error: error.message };
    }
  }

  revalidatePath('/', 'layout');
};

export default upsertEventType;
