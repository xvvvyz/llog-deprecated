'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { Database } from '(types)/database';
import { TemplateDataType } from '(types)/template';
import supabase from '(utilities)/global-supabase-client';
import TEMPLATE_TYPE_LABELS from '(utilities)/constant-template-type-labels';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import useDefaultValues from '(utilities)/use-default-values';
import { GetEventTypeWithInputsData } from '(utilities)/get-event-type-with-inputs';
import { GetTemplateData } from '(utilities)/get-template';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import sanitizeHtml from '(utilities)/sanitize-html';
import useBackLink from '(utilities)/use-back-link';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { useRouter } from 'next/navigation';
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
  Database['public']['Tables']['event_types']['Row'] & {
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
  const templateData = template?.data as unknown as TemplateDataType;

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.EventTypeForm,
    defaultValues: {
      content: eventType?.content ?? templateData?.content,
      id: eventType?.id,
      inputs: eventType
        ? forceArray(eventType?.inputs).map(({ input }) => input)
        : forceArray(availableInputs).filter(({ id }) =>
            forceArray(templateData?.inputIds).includes(id)
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
      <Input label="Name" {...form.register('name')} />
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => <RichTextarea label="Description" {...field} />}
      />
      <Controller
        control={form.control}
        name="inputs"
        render={({ field }) => (
          <Select
            isCreatable
            isLoading={isTransitioning}
            isMulti
            label="Inputs"
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
            options={forceArray(availableInputs)}
            {...field}
          />
        )}
      />
      <div className="space-y-4">
        <Button
          className="mt-8 w-full"
          loading={form.formState.isSubmitting || isRedirecting}
          loadingText="Saving…"
          type="submit"
        >
          Save {defaultValues.type} type
        </Button>
        <Button
          className="w-full"
          colorScheme="transparent"
          onClick={() => {
            const values = form.getValues();

            globalValueCache.set(CacheKeys.TemplateForm, {
              content: values.content,
              inputs: values.inputs,
              name: values.name,
              type: {
                id: values.type,
                label: TEMPLATE_TYPE_LABELS[values.type],
              },
            });

            globalValueCache.set(CacheKeys.EventTypeForm, values);

            router.push(
              formatCacheLink({
                backLink,
                path: '/templates/add',
                useCache: true,
              })
            );
          }}
        >
          Save as template
        </Button>
      </div>
    </form>
  );
};

export type { EventTypeFormValues };
export default EventTypeForm;
