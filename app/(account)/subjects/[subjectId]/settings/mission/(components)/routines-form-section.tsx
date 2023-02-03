'use client';

import { LabelSpan } from '(components)/label';
import Menu from '(components)/menu';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { EventTemplate } from '(types)/event-template';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import TemplateTypes from '(utilities)/enum-template-types';
import formatCacheLink from '(utilities)/format-cache-link';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import useBackLink from '(utilities)/use-back-link';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import {
  Controller,
  FieldValues,
  useFieldArray,
  UseFormReturn,
} from 'react-hook-form';

interface RoutinesFormSection<T extends FieldValues> {
  form: UseFormReturn<T>;
  inputOptions: NonNullable<ListInputsData>;
  sessionIndex: number;
  templateOptions: NonNullable<ListTemplatesData>;
}

const RoutinesFormSection = <T extends FieldValues>({
  form,
  inputOptions,
  sessionIndex,
  templateOptions,
}: RoutinesFormSection<T>) => {
  const backLink = useBackLink({ useCache: true });
  const router = useRouter();
  const name = `routines.${sessionIndex}`;

  const eventTypesArray = useFieldArray({
    control: form.control,
    name: name as T[string],
  });

  return (
    <li>
      <fieldset>
        <LabelSpan as="legend" className="pb-2">
          Session {sessionIndex + 1}
        </LabelSpan>
        <ul>
          {eventTypesArray.fields.map((eventType, routineIndex) => {
            const menu = (
              <Menu
                items={[
                  {
                    icon: <TrashIcon className="w-5" />,
                    onClick: () => eventTypesArray.remove(routineIndex),
                    text: 'Delete routine',
                  },
                ]}
              />
            );

            return (
              <li className="mb-3" key={eventType.id}>
                <Controller
                  control={form.control}
                  name={`${name}.${routineIndex}.content` as T[string]}
                  render={({ field }) => (
                    <RichTextarea
                      className="rounded-b-none"
                      placeholder="Description"
                      right={menu}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name={`${name}.${routineIndex}.inputs` as T[string]}
                  render={({ field }) => (
                    <Select
                      className="rounded-t-none border-t-0"
                      creatable
                      isMulti
                      noOptionsMessage={() => null}
                      onCreateOption={async (value: unknown) => {
                        globalValueCache.set(CacheKeys.InputForm, {
                          label: value,
                        });

                        globalValueCache.set(
                          CacheKeys.MissionForm,
                          form.getValues()
                        );

                        await router.push(
                          formatCacheLink({
                            backLink,
                            path: '/inputs/add',
                            updateCacheKey: CacheKeys.MissionForm,
                            updateCachePath: `${name}.${routineIndex}.inputs`,
                            useCache: true,
                          })
                        );
                      }}
                      options={inputOptions}
                      placeholder="Inputs"
                      {...field}
                    />
                  )}
                />
              </li>
            );
          })}
        </ul>
        <Select
          creatable
          instanceId={`${name}Template`}
          noOptionsMessage={() => null}
          onChange={(e) => {
            const template = e as EventTemplate;
            const values = form.getValues();

            eventTypesArray.append({
              content: template?.data?.content || '',
              inputs: inputOptions.filter((input) =>
                template?.data?.inputIds?.includes(input.id)
              ),
              name: template?.name,
              order: eventTypesArray.fields.length,
              subject_id: values.id ?? '',
              type: EventTypes.Routine,
            } as T[string]);
          }}
          onCreateOption={async (value: unknown) =>
            eventTypesArray.append({
              content: value,
              inputs: [],
              order: eventTypesArray.fields.length,
              subject_id: form.getValues().id ?? '',
              type: EventTypes.Routine,
            } as T[string])
          }
          options={templateOptions.filter(
            (template) => template.type === TemplateTypes.Routine
          )}
          placeholder="Add routine"
          value={null}
        />
      </fieldset>
    </li>
  );
};

export default RoutinesFormSection;
