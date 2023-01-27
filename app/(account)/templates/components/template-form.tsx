'use client';

import Button from 'components/button';
import Input from 'components/input';
import Label from 'components/label';
import RadioGroup from 'components/radio-group';
import RichTextarea from 'components/rich-textarea';
import Select from 'components/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Database } from 'types/database';
import { EventTemplateData } from 'types/event-template';
import supabase from 'utilities/browser-supabase-client';
import TemplateTypes from 'utilities/enum-template-types';
import forceArray from 'utilities/force-array';
import { GetTemplateData } from 'utilities/get-template';
import globalValueCache from 'utilities/global-value-cache';
import { ListInputsData } from 'utilities/list-inputs';
import sanitizeHtml from 'utilities/sanitize-html';
import sleep from 'utilities/sleep';
import useBackLink from 'utilities/use-back-link';

interface TemplateFormProps {
  availableInputs: ListInputsData;
  template?: GetTemplateData;
}

type TemplateFormValues =
  Database['public']['Tables']['templates']['Insert'] & {
    content: string;
    inputs: Database['public']['Tables']['inputs']['Row'][];
  };

const TemplateForm = ({ availableInputs, template }: TemplateFormProps) => {
  const backLink = useBackLink({ useCache: 'true' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateData = template?.data as unknown as EventTemplateData;

  const form = useForm<TemplateFormValues>({
    defaultValues:
      searchParams.has('useCache') &&
      globalValueCache.has('template_form_values')
        ? globalValueCache.get('template_form_values')
        : {
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
              },
              id,
              name,
              public: p,
              type,
            })
            .single();

          if (templateError) {
            alert(templateError?.message);
            return;
          }

          await router.push(searchParams.get('back') ?? '/templates');
          await router.refresh();
          await sleep();
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
        <div className="flex justify-between">
          Inputs
          <Button
            className="underline"
            href={`/inputs/add?back=${backLink}`}
            onClick={() =>
              globalValueCache.set('template_form_values', form.getValues())
            }
            variant="link"
          >
            Create new input
          </Button>
        </div>
        <Controller
          control={form.control}
          name="inputs"
          render={({ field }) => (
            <Select isMulti options={availableInputs ?? []} {...field} />
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
