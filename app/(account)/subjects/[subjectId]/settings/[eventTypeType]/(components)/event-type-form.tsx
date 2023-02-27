'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { Database } from '(types)/database';
import { TemplateDataType } from '(types)/template';
import supabase from '(utilities)/browser-supabase-client';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import useDefaultValues from '(utilities)/get-default-values';
import { GetEventTypeWithInputsData } from '(utilities)/get-event-type-with-inputs';
import { GetTemplateData } from '(utilities)/get-template';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import sanitizeHtml from '(utilities)/sanitize-html';
import useBackLink from '(utilities)/use-back-link';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EventTypeFormProps {
  availableInputs: ListInputsData;
  eventType?: GetEventTypeWithInputsData;
  subjectId: string;
  template?: GetTemplateData;
  type?: EventTypes;
}

type EventTypeFormValues =
  Database['public']['Tables']['event_types']['Insert'] & {
    inputs: Database['public']['Tables']['inputs']['Row'][];
  };

const EventTypeForm = ({
  availableInputs,
  eventType,
  subjectId,
  template,
  type,
}: EventTypeFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const [redirect, isRedirecting] = useSubmitRedirect();
  const backLink = useBackLink({ useCache: true });
  const router = useRouter();
  const searchParams = useSearchParams();

  // hack to force template to be empty when no templateId is present
  // client components seem to cache previous values passed?
  template = searchParams.has('templateId') ? template : null;

  const templateData = template?.data as unknown as TemplateDataType;

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.EventTypeForm,
    defaultValues: {
      content: eventType?.content ?? templateData?.content,
      id: eventType?.id,
      inputs: eventType
        ? forceArray(eventType?.inputs).map(({ input }) => input)
        : forceArray(templateData?.inputIds).map((inputId) =>
            availableInputs?.find(({ id }) => id === inputId)
          ),
      name: eventType?.name ?? template?.name ?? '',
      order: eventType?.order,
      type: eventType?.type ?? type,
    },
  });

  const form = useForm<EventTypeFormValues>({ defaultValues });

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
      onSubmit={form.handleSubmit(
        async ({ content, id, inputs, name, order, type }) => {
          const { data: eventTypeData, error: eventTypeError } = await supabase
            .from('event_types')
            .upsert({
              content: sanitizeHtml(content) || null,
              id,
              name,
              order,
              subject_id: subjectId,
              type,
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
                }))
              );

            if (insertEventTypeInputsError) {
              alert(insertEventTypeInputsError.message);
              return;
            }
          }

          await redirect(`/subjects/${subjectId}/settings`);
        }
      )}
    >
      <Label>
        <LabelSpan>Name</LabelSpan>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      <Label>
        <LabelSpan>Description</LabelSpan>
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => <RichTextarea {...field} />}
        />
      </Label>
      <Label>
        <LabelSpan>Inputs</LabelSpan>
        <Controller
          control={form.control}
          name="inputs"
          render={({ field }) => (
            <Select
              isCreatable
              isLoading={isTransitioning}
              isMulti
              onCreateOption={async (value: unknown) => {
                globalValueCache.set(CacheKeys.InputForm, { label: value });
                globalValueCache.set(CacheKeys.EventTypeForm, form.getValues());

                startTransition(() =>
                  router.push(
                    formatCacheLink({
                      backLink,
                      path: '/inputs/add',
                      updateCacheKey: CacheKeys.EventTypeForm,
                      updateCachePath: 'inputs',
                      useCache: true,
                    })
                  )
                );
              }}
              options={availableInputs ?? []}
              {...field}
            />
          )}
        />
      </Label>
      <Button
        className="mt-4 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export type { EventTypeFormValues };
export default EventTypeForm;
