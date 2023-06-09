'use client';

import RichTextarea from '@/(account)/_components/rich-textarea';
import Select from '@/(account)/_components/select';
import TEMPLATE_TYPE_LABELS from '@/(account)/_constants/constant-template-type-labels';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import EventTypes from '@/(account)/_constants/enum-event-types';
import useBackLink from '@/(account)/_hooks/use-back-link';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import useSubmitRedirect from '@/(account)/_hooks/use-submit-redirect';
import useSupabase from '@/(account)/_hooks/use-supabase';
import { GetEventTypeWithInputsData } from '@/(account)/_server/get-event-type-with-inputs';
import { GetTemplateData } from '@/(account)/_server/get-template';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { TemplateDataType } from '@/(account)/_types/template';
import forceArray from '@/(account)/_utilities/force-array';
import formatCacheLink from '@/(account)/_utilities/format-cache-link';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { Database } from '@/_types/database';
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
  const supabase = useSupabase();
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
      className="flex flex-col gap-6 rounded border border-alpha-1 bg-bg-2 px-4 py-8 sm:px-8"
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
            formatCreateLabel={(value: string) => `Create "${value}" input`}
            isCreatable
            isLoading={isTransitioning}
            isMulti
            label="Inputs"
            noOptionsMessage={() => 'Type to create a new input'}
            onCreateOption={async (value: unknown) => {
              globalValueCache.set(CacheKeys.InputForm, { label: value });
              globalValueCache.set(CacheKeys.EventTypeForm, form.getValues());

              startTransition(() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: '/inputs/create',
                    updateCacheKey: CacheKeys.EventTypeForm,
                    updateCachePath: 'inputs',
                    useCache: true,
                  })
                )
              );
            }}
            options={forceArray(availableInputs)}
            placeholder="Select inputs or type to create…"
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
          Save {defaultValues.type}
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
                path: '/templates/create',
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
