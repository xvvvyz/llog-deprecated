'use client';

import RichTextarea from '@/(account)/_components/rich-textarea';
import Select from '@/(account)/_components/select';
import TEMPLATE_TYPE_LABELS from '@/(account)/_constants/constant-template-type-labels';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import TemplateTypes from '@/(account)/_constants/enum-template-types';
import useBackLink from '@/(account)/_hooks/use-back-link';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import useSubmitRedirect from '@/(account)/_hooks/use-submit-redirect';
import useSupabase from '@/(account)/_hooks/use-supabase';
import { GetTemplateData } from '@/(account)/_server/get-template';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { TemplateDataType } from '@/(account)/_types/template';
import forceArray from '@/(account)/_utilities/force-array';
import formatCacheLink from '@/(account)/_utilities/format-cache-link';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import sortInputs from '@/(account)/_utilities/sort-inputs';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { Database, Json } from '@/_types/database';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface TemplateFormProps {
  availableInputs: ListInputsData;
  template?: GetTemplateData;
}

type TemplateFormValues = Database['public']['Tables']['templates']['Row'] & {
  content: string;
  inputs: Database['public']['Tables']['inputs']['Row'][];
  type: { id: TemplateTypes };
};

const TemplateForm = ({ availableInputs, template }: TemplateFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const [redirect, isRedirecting] = useSubmitRedirect();
  const backLink = useBackLink({ useCache: true });
  const router = useRouter();
  const supabase = useSupabase();
  const templateData = template?.data as unknown as TemplateDataType;

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.TemplateForm,
    defaultValues: {
      content: templateData?.content,
      id: template?.id,
      inputs: forceArray(availableInputs).filter(({ id }) =>
        forceArray(templateData?.inputIds).includes(id)
      ),
      name: template?.name ?? '',
      public: template?.public ?? false,
      type: template?.type
        ? { id: template.type, label: TEMPLATE_TYPE_LABELS[template.type] }
        : null,
    },
  });

  const form = useForm<TemplateFormValues>({ defaultValues });

  return (
    <form
      className="flex flex-col gap-6 rounded border border-alpha-1 bg-bg-2 px-4 py-8 sm:px-8"
      onSubmit={form.handleSubmit(
        async ({ content, id, inputs, name, public: p, type }) => {
          const { error: templateError } = await supabase
            .from('templates')
            .upsert({
              data: {
                content: sanitizeHtml(content),
                inputIds: inputs.map((input) => input.id),
              } as Json,
              id,
              name: name.trim(),
              public: p,
              type: type?.id,
            })
            .single();

          if (templateError) {
            alert(templateError?.message);
            return;
          }

          await redirect('/templates');
        }
      )}
    >
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <Select
            isClearable={false}
            isSearchable={false}
            label="Type"
            options={[
              {
                id: TemplateTypes.Observation,
                label: TEMPLATE_TYPE_LABELS[TemplateTypes.Observation],
              },
              {
                id: TemplateTypes.Routine,
                label: TEMPLATE_TYPE_LABELS[TemplateTypes.Routine],
              },
            ]}
            {...field}
          />
        )}
      />
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
              globalValueCache.set(CacheKeys.TemplateForm, form.getValues());

              startTransition(() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: '/inputs/create',
                    updateCacheKey: CacheKeys.TemplateForm,
                    updateCachePath: 'inputs',
                    useCache: true,
                  })
                )
              );
            }}
            options={forceArray(availableInputs).sort(sortInputs)}
            placeholder="Select inputs or type to create…"
            {...field}
          />
        )}
      />
      <Button
        className="mt-8 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save template
      </Button>
    </form>
  );
};

export default TemplateForm;
