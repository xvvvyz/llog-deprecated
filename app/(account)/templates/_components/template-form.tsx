'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import Select from '@/_components/select';
import CacheKeys from '@/_constants/enum-cache-keys';
import useBackLink from '@/_hooks/use-back-link';
import useDefaultValues from '@/_hooks/use-default-values';
import useSubmitRedirect from '@/_hooks/use-submit-redirect';
import useSupabase from '@/_hooks/use-supabase';
import { GetTemplateData } from '@/_server/get-template';
import { ListInputsData } from '@/_server/list-inputs';
import { Database, Json } from '@/_types/database';
import { TemplateDataType } from '@/_types/template';
import forceArray from '@/_utilities/force-array';
import formatCacheLink from '@/_utilities/format-cache-link';
import globalValueCache from '@/_utilities/global-value-cache';
import sanitizeHtml from '@/_utilities/sanitize-html';
import sortInputs from '@/_utilities/sort-inputs';
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
        forceArray(templateData?.inputIds).includes(id),
      ),
      name: template?.name ?? '',
      public: template?.public ?? false,
    },
  });

  const form = useForm<TemplateFormValues>({ defaultValues });

  return (
    <form
      className="form"
      onSubmit={form.handleSubmit(async (values) => {
        const { error: templateError } = await supabase
          .from('templates')
          .upsert({
            data: {
              content: sanitizeHtml(values.content),
              inputIds: values.inputs.map((input) => input.id),
            } as Json,
            id: values.id,
            name: values.name.trim(),
            public: values.public,
          })
          .single();

        if (templateError) {
          alert(templateError?.message);
          return;
        }

        await redirect('/templates');
      })}
    >
      <Input label="Name" maxLength={49} required {...form.register('name')} />
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => <RichTextarea label="Content" {...field} />}
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
            name={field.name}
            noOptionsMessage={() => 'Type to create a new input'}
            onBlur={field.onBlur}
            onChange={(value) => field.onChange(value as any)}
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
                  }),
                ),
              );
            }}
            options={forceArray(availableInputs).sort(sortInputs)}
            placeholder="Select inputs or type to create…"
            value={field.value as any}
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
