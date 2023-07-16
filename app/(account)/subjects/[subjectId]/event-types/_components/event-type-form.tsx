'use client';

import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import useSubmitRedirect from '@/(account)/_hooks/use-submit-redirect';
import { GetEventTypeWithInputsData } from '@/(account)/_server/get-event-type-with-inputs';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { ListTemplatesWithDataData } from '@/(account)/_server/list-templates-with-data';
import forceArray from '@/(account)/_utilities/force-array';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import EventTypeFormSection from '@/(account)/subjects/[subjectId]/_components/event-type-form-section';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { useForm } from 'react-hook-form';

interface EventTypeFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesWithDataData;
  eventType?: GetEventTypeWithInputsData;
  subjectId: string;
}

type EventTypeFormValues =
  Database['public']['Tables']['event_types']['Insert'] & {
    inputs: Database['public']['Tables']['inputs']['Row'][];
  };

const EventTypeForm = ({
  availableInputs,
  availableTemplates,
  eventType,
  subjectId,
}: EventTypeFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const supabase = useSupabase();

  const form = useForm<EventTypeFormValues>({
    defaultValues: useDefaultValues({
      cacheKey: CacheKeys.EventTypeForm,
      defaultValues: {
        content: eventType?.content,
        id: eventType?.id,
        inputs: forceArray(eventType?.inputs).map(({ input }) => input),
        name: eventType?.name,
      },
    }),
  });

  return (
    <form
      className="form gap-0 p-0"
      onSubmit={form.handleSubmit(async ({ content, id, inputs, name }) => {
        const { data: eventTypeData, error: eventTypeError } = await supabase
          .from('event_types')
          .upsert({
            content: sanitizeHtml(content) || null,
            id,
            name,
            subject_id: subjectId,
          })
          .select('id')
          .single();

        if (eventTypeError) {
          alert(eventTypeError.message);
          return;
        }

        form.setValue('id', eventTypeData.id);

        const { error: deleteEventTypeInputsError } = await supabase
          .from('event_type_inputs')
          .delete()
          .eq('event_type_id', eventTypeData.id);

        if (deleteEventTypeInputsError) {
          alert(deleteEventTypeInputsError.message);
          return;
        }

        if (inputs.length) {
          const { error: insertEventTypeInputsError } = await supabase
            .from('event_type_inputs')
            .insert(
              inputs.map((input, order) => ({
                event_type_id: eventTypeData.id,
                input_id: input.id,
                order,
              })),
            );

          if (insertEventTypeInputsError) {
            alert(insertEventTypeInputsError.message);
            return;
          }
        }

        await redirect(`/subjects/${subjectId}/timeline`);
      })}
    >
      <EventTypeFormSection
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        cacheKey={CacheKeys.EventTypeForm}
        form={form}
        isRedirecting={isRedirecting}
      />
    </form>
  );
};

export default EventTypeForm;
