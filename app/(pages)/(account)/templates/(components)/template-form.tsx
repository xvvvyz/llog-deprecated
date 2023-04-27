'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { Database, Json } from '(types)/database';
import { TemplateDataType } from '(types)/template';
import supabase from '(utilities)/global-supabase-client';
import TEMPLATE_TYPE_LABELS from '(utilities)/constant-template-type-labels';
import CacheKeys from '(utilities)/enum-cache-keys';
import TemplateTypes from '(utilities)/enum-template-types';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import useDefaultValues from '(utilities)/use-default-values';
import { GetTemplateData } from '(utilities)/get-template';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import sanitizeHtml from '(utilities)/sanitize-html';
import sortInputs from '(utilities)/sort-inputs';
import useBackLink from '(utilities)/use-back-link';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
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
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
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
            isCreatable
            isLoading={isTransitioning}
            isMulti
            label="Inputs"
            onCreateOption={async (value: unknown) => {
              globalValueCache.set(CacheKeys.InputForm, { label: value });
              globalValueCache.set(CacheKeys.TemplateForm, form.getValues());

              startTransition(() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: '/inputs/add',
                    updateCacheKey: CacheKeys.TemplateForm,
                    updateCachePath: 'inputs',
                    useCache: true,
                  })
                )
              );
            }}
            options={forceArray(availableInputs).sort(sortInputs)}
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
