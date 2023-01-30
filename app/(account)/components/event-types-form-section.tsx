import Input from 'components/input';
import RichTextarea from 'components/rich-textarea';
import Select from 'components/select';

import {
  ArrayPath,
  Controller,
  FieldValues,
  useFieldArray,
  UseFormReturn,
} from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { Database } from 'types/database';
import { EventTemplate } from 'types/event-template';
import forceArray from 'utilities/force-array';
import formatCacheLink from 'utilities/format-cache-link';
import globalValueCache, { GlobalCacheKey } from 'utilities/global-value-cache';
import { ListInputsData } from 'utilities/list-inputs';
import { ListTemplatesData } from 'utilities/list-templates';
import useBackLink from 'utilities/use-back-link';

interface EventTypesFormSectionProps<T extends FieldValues> {
  cacheKey: GlobalCacheKey;
  form: UseFormReturn<T>;
  inputOptions: ListInputsData;
  label: string;
  isMission?: boolean;
  name: ArrayPath<T>;
  templateOptions: ListTemplatesData;
  templateType: Database['public']['Enums']['template_type'];
  type: Database['public']['Enums']['event_type'];
}

const EventTypesFormSection = <T extends FieldValues>({
  cacheKey,
  form,
  inputOptions,
  label,
  isMission = false,
  name,
  templateOptions,
  templateType,
  type,
}: EventTypesFormSectionProps<T>) => {
  const backLink = useBackLink({ useCache: 'true' });
  const eventTypesArray = useFieldArray({ control: form.control, name });
  const router = useRouter();

  return (
    <fieldset>
      <legend className="mb-2 text-fg-2">{label}</legend>
      <ul>
        {eventTypesArray.fields.map((eventType, index) => (
          <li className="mb-3" key={eventType.id}>
            {!isMission && (
              <Controller
                control={form.control}
                name={`${name}.${index}.name` as T[typeof name][number]['name']}
                render={({ field }) => (
                  <Input
                    className="rounded-b-none"
                    placeholder="Name"
                    {...field}
                  />
                )}
              />
            )}
            <Controller
              control={form.control}
              name={
                `${name}.${index}.content` as T[typeof name][number]['content']
              }
              render={({ field }) => (
                <RichTextarea
                  autoFocus={
                    (eventType as unknown as { autoFocus: boolean }).autoFocus
                  }
                  className={
                    isMission ? 'rounded-b-none' : 'rounded-none border-t-0'
                  }
                  name={field.name}
                  onChange={field.onChange}
                  placeholder="Description"
                  value={field.value}
                />
              )}
            />
            <Controller
              control={form.control}
              name={
                `${name}.${index}.inputs` as T[typeof name][number]['inputs']
              }
              render={({ field }) => (
                <Select
                  className="rounded-t-none border-t-0"
                  creatable
                  isMulti
                  noOptionsMessage={() => `Type to create new input`}
                  onCreateOption={async (value: unknown) => {
                    globalValueCache.set('input_form_values', { label: value });
                    globalValueCache.set(cacheKey, form.getValues());

                    await router.push(
                      formatCacheLink({
                        backLink,
                        path: '/inputs/add',
                        updateCacheKey: cacheKey,
                        updateCachePath: `${name}.${index}.inputs`,
                        useCache: true,
                      })
                    );
                  }}
                  options={forceArray(inputOptions)}
                  placeholder="Inputs"
                  {...field}
                />
              )}
            />
          </li>
        ))}
      </ul>
      <Select
        creatable
        name={`${name}Template`}
        noOptionsMessage={() => `Type to create new ${type}`}
        onChange={(e) => {
          const template = e as EventTemplate;
          const values = form.getValues();

          eventTypesArray.append({
            content: template?.data?.content || (isMission ? '' : null),
            inputs: forceArray(inputOptions).filter((input) =>
              template?.data?.inputIds?.includes(input.id)
            ),
            name: template?.name || (isMission ? null : ''),
            order: eventTypesArray.fields.length,
            subject_id: values.id ?? '',
            template_id: template?.id ?? null,
            type,
          } as T[typeof name][number]);
        }}
        onCreateOption={async (value: unknown) => {
          const values = form.getValues();

          eventTypesArray.append({
            autoFocus: true,
            content: isMission ? value : null,
            inputs: [],
            name: isMission ? null : value,
            order: eventTypesArray.fields.length,
            subject_id: values.id ?? '',
            template_id: null,
            type,
          } as T[typeof name][number]);
        }}
        options={forceArray(templateOptions).filter(
          (template) => template.type === templateType
        )}
        placeholder={`Add ${type}`}
        value={null}
      />
    </fieldset>
  );
};

export default EventTypesFormSection;
