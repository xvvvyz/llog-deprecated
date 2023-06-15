'use client';

import RichTextarea from '@/(account)/_components/rich-textarea';
import Select from '@/(account)/_components/select';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import useBackLink from '@/(account)/_hooks/use-back-link';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import useSubmitRedirect from '@/(account)/_hooks/use-submit-redirect';
import { GetEventTypeWithInputsData } from '@/(account)/_server/get-event-type-with-inputs';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { ListTemplatesWithDataData } from '@/(account)/_server/list-templates-with-data';
import forceArray from '@/(account)/_utilities/force-array';
import formatCacheLink from '@/(account)/_utilities/format-cache-link';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import TemplateSelect from '@/(account)/subjects/[subjectId]/event-types/_components/template-select';
import Button from '@/_components/button';
import Input from '@/_components/input';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
  const [isTransitioning, startTransition] = useTransition();
  const [redirect, isRedirecting] = useSubmitRedirect();
  const backLink = useBackLink({ useCache: true });
  const router = useRouter();
  const supabase = useSupabase();

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.EventTypeForm,
    defaultValues: {
      content: eventType?.content,
      id: eventType?.id,
      inputs: forceArray(eventType?.inputs).map(({ input }) => input),
      name: eventType?.name,
    },
  });

  const form = useForm<EventTypeFormValues>({ defaultValues });

  return (
    <form
      className="form"
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
              }))
            );

          if (insertEventTypeInputsError) {
            alert(insertEventTypeInputsError.message);
            return;
          }
        }

        await redirect(`/subjects/${subjectId}/timeline`);
      })}
    >
      <TemplateSelect
        availableInputs={availableInputs}
        formSetValue={form.setValue}
        templateOptions={availableTemplates}
      />
      <hr className="mx-4 mt-2" />
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
          Save event type
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

export default EventTypeForm;
