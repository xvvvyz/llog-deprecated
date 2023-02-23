'use client';

import Menu from '(components)/menu';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { TemplateType } from '(types)/template';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import TemplateTypes from '(utilities)/enum-template-types';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import useBackLink from '(utilities)/use-back-link';
import { TrashIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import EventBanner from '../../../(components)/event-banner';
import EventComments from '../../../(components)/event-comments';
import EventInputs from '../../../(components)/event-inputs';

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
  const [isTransitioning, startTransition] = useTransition();
  const backLink = useBackLink({ useCache: true });
  const name = `routines.${sessionIndex}`;
  const router = useRouter();

  const eventTypesArray = useFieldArray({
    control: form.control,
    name: name as T[string],
  });

  return (
    <>
      <ul>
        {eventTypesArray.fields.map((eventType, routineIndex) => {
          const event = firstIfArray((eventType as any).event);

          return (
            <li className="mb-3" key={eventType.id}>
              <Controller
                control={form.control}
                name={`${name}.${routineIndex}.content` as T[string]}
                render={({ field }) => (
                  <RichTextarea
                    className="rounded-b-none"
                    placeholder="Description"
                    right={
                      <Menu className="h-full w-full">
                        <Menu.Button className="h-full w-full">
                          <EllipsisVerticalIcon className="w-5" />
                        </Menu.Button>
                        <Menu.Items>
                          <Menu.Item
                            onClick={() => eventTypesArray.remove(routineIndex)}
                          >
                            <TrashIcon className="w-5 text-fg-3" />
                            Delete routine
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    }
                    {...field}
                  />
                )}
              />
              <Controller
                control={form.control}
                name={`${name}.${routineIndex}.inputs` as T[string]}
                render={({ field }) => (
                  <Select
                    className={twMerge(
                      'rounded-t-none border-t-0',
                      event && 'rounded-b-none'
                    )}
                    isCreatable
                    isLoading={isTransitioning}
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

                      startTransition(() =>
                        router.push(
                          formatCacheLink({
                            backLink,
                            path: '/inputs/add',
                            updateCacheKey: CacheKeys.MissionForm,
                            updateCachePath: `${name}.${routineIndex}.inputs`,
                            useCache: true,
                          })
                        )
                      );
                    }}
                    options={inputOptions}
                    placeholder="Inputs"
                    {...field}
                  />
                )}
              />
              {event && (
                <div className="rounded-b border border-t-0 border-alpha-1 bg-alpha-reverse-1">
                  <EventBanner
                    className="px-4 py-2"
                    createdAt={event.created_at}
                    profile={event.profile}
                  />
                  <EventInputs inputs={forceArray(event.inputs)} />
                  <EventComments
                    className="border-t border-alpha-1 p-4"
                    comments={forceArray(event.comments)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Select
        instanceId={`${name}Template`}
        isCreatable
        noOptionsMessage={() => null}
        onChange={(e) => {
          const template = e as TemplateType;

          eventTypesArray.append({
            content: template?.data?.content || '',
            inputs: inputOptions.filter((input) =>
              template?.data?.inputIds?.includes(input.id)
            ),
            name: template?.name,
            type: EventTypes.Routine,
          } as T[string]);
        }}
        onCreateOption={async (value: unknown) =>
          eventTypesArray.append({
            content: value,
            inputs: [],
            type: EventTypes.Routine,
          } as T[string])
        }
        options={templateOptions.filter(
          (template) => template.type === TemplateTypes.Routine
        )}
        placeholder="Add routine"
        value={null}
      />
    </>
  );
};

export default RoutinesFormSection;
