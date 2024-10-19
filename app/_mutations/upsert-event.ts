'use server';

import { EventFormValues } from '@/_components/event-form';
import InputType from '@/_constants/enum-input-type';
import { GetEventTypeWithInputsAndOptionsData } from '@/_queries/get-event-type-with-inputs-and-options';
import { Database, Json } from '@/_types/database';
import DurationInputType from '@/_types/duration-input';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const upsertEvent = async (
  context: {
    eventId?: string;
    eventTypeId: string;
    eventTypeInputs: NonNullable<GetEventTypeWithInputsAndOptionsData>['inputs'];
    isProtocol: boolean;
    subjectId: string;
  },
  data: EventFormValues,
) => {
  const supabase = await createServerSupabaseClient();

  const { data: event, error } = await supabase
    .from('events')
    .upsert({
      created_at: data.completionTime,
      event_type_id: context.eventTypeId,
      id: context.eventId,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  if (context.eventId) {
    await supabase
      .from('event_inputs')
      .delete()
      .eq('event_id', context.eventId);
  }

  const { eventInputs } = data.inputs.reduce<{
    eventInputs: Database['public']['Tables']['event_inputs']['Insert'][];
  }>(
    (acc, input, i) => {
      if (
        input === undefined ||
        input === null ||
        input === '' ||
        (Array.isArray(input) && !input.some((v) => v))
      ) {
        return acc;
      }

      const eventTypeInput = context.eventTypeInputs[i].input;
      if (!eventTypeInput) return acc;

      const payload: Database['public']['Tables']['event_inputs']['Insert'] = {
        event_id: event.id,
        input_id: eventTypeInput.id,
        input_option_id: null,
        value: null,
      };

      switch (eventTypeInput.type) {
        case InputType.Checkbox:
        case InputType.Number:
        case InputType.Stopwatch: {
          payload.value = input as Json;
          acc.eventInputs.push(payload);
          return acc;
        }

        case InputType.Duration: {
          const [h, m, s] = input as DurationInputType;

          payload.value = String(
            Number(h?.id ?? 0) * 60 * 60 +
              Number(m?.id ?? 0) * 60 +
              Number(s?.id ?? 0),
          );

          acc.eventInputs.push(payload);
          return acc;
        }

        case InputType.MultiSelect: {
          (input as string[]).forEach((id, order) =>
            acc.eventInputs.push({ ...payload, input_option_id: id, order }),
          );

          return acc;
        }

        case InputType.Select: {
          payload.input_option_id = input as string;
          acc.eventInputs.push(payload);
          return acc;
        }

        default: {
          return acc;
        }
      }
    },
    { eventInputs: [] },
  );

  if (eventInputs.length) {
    const { error } = await supabase.from('event_inputs').insert(eventInputs);

    if (error) {
      if (!context.eventId) {
        await supabase.from('events').delete().eq('id', event.id);
      }

      return { error: error.message };
    }
  }

  if (data.comment) {
    const { error } = await supabase.from('comments').insert({
      content: sanitizeHtml(data.comment) as string,
      event_id: event.id,
    });

    if (error) {
      if (!context.eventId) {
        await supabase.from('events').delete().eq('id', event.id);
      }

      return { error: error.message };
    }
  }

  revalidatePath('/', 'layout');
};

export default upsertEvent;
