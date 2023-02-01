'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label from '(components)/label';
import RadioGroup from '(components)/radio-group';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { Database, Json } from '(types)/database';
import { EventTemplateData } from '(types)/event-template';
import supabase from '(utilities)/browser-supabase-client';
import TemplateTypes from '(utilities)/enum-template-types';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import useDefaultValues from '(utilities)/get-default-values';
import { GetTemplateData } from '(utilities)/get-template';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import sanitizeHtml from '(utilities)/sanitize-html';
import useBackLink from '(utilities)/use-back-link';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { useRouter } from 'next/navigation';
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
  const backLink = useBackLink({ useCache: 'true' });
  const router = useRouter();
  const submitRedirect = useSubmitRedirect();
  const templateData = template?.data as unknown as EventTemplateData;

  const defaultValues = useDefaultValues({
    cacheKey: 'template_form_values',
    defaultValues: {
      content: templateData?.content ?? '',
      id: template?.id,
      inputs: forceArray(templateData?.inputIds).map((inputId) =>
        availableInputs?.find(({ id }) => id === inputId)
      ),
      name: template?.name ?? '',
      public: template?.public ?? false,
      type: template?.type ?? TemplateTypes.Observation,
    },
  });

  const form = useForm<TemplateFormValues>({ defaultValues });

  return (
    <form
      className="flex flex-col gap-6"
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
              type,
            })
            .single();

          if (templateError) {
            alert(templateError?.message);
            return;
          }

          await submitRedirect('/templates');
        }
      )}
    >
      <Label>
        Type
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <RadioGroup
              options={[
                { label: 'Observation', value: TemplateTypes.Observation },
                { label: 'Routine', value: TemplateTypes.Routine },
              ]}
              {...field}
            />
          )}
        />
      </Label>
      <Label>
        Name
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      <Label>
        Description
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => <RichTextarea {...field} />}
        />
      </Label>
      <Label>
        Inputs
        <Controller
          control={form.control}
          name="inputs"
          render={({ field }) => (
            <Select
              creatable
              isMulti
              noOptionsMessage={() => `Type to create new input`}
              onCreateOption={async (value: unknown) => {
                globalValueCache.set('input_form_values', { label: value });
                globalValueCache.set('template_form_values', form.getValues());

                await router.push(
                  formatCacheLink({
                    backLink,
                    path: '/inputs/add',
                    updateCacheKey: 'template_form_values',
                    updateCachePath: 'inputs',
                    useCache: true,
                  })
                );
              }}
              options={availableInputs ?? []}
              {...field}
            />
          )}
        />
      </Label>
      <Button
        className="mt-6 w-full"
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export default TemplateForm;
