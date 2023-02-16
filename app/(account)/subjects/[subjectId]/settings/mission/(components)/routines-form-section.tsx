'use client';

import { LabelSpan } from '(components)/label';
import Menu from '(components)/menu';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import { TemplateType } from '(types)/template';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import TemplateTypes from '(utilities)/enum-template-types';
import formatCacheLink from '(utilities)/format-cache-link';
import globalValueCache from '(utilities)/global-value-cache';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import useBackLink from '(utilities)/use-back-link';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import {
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  Controller,
  FieldValues,
  useFieldArray,
  UseFormReturn,
} from 'react-hook-form';

interface RoutinesFormSection<T extends FieldValues> {
  duplicateSession: () => void;
  form: UseFormReturn<T>;
  inputOptions: NonNullable<ListInputsData>;
  sessionIndex: number;
  templateOptions: NonNullable<ListTemplatesData>;
}

const RoutinesFormSection = <T extends FieldValues>({
  duplicateSession,
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
    <li>
      <LabelSpan className="flex max-w-none items-center justify-between pb-2 text-fg-3">
        Session {sessionIndex + 1}
        <Menu className="-m-3 p-3">
          <Menu.Button className="-m-3 p-3">
            <EllipsisHorizontalIcon className="w-5" />
          </Menu.Button>
          <Menu.Items>
            <Menu.Item onClick={duplicateSession}>
              <DocumentDuplicateIcon className="w-5 text-fg-3" />
              Duplicate session
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </LabelSpan>
      <ul>
        {eventTypesArray.fields.map((eventType, routineIndex) => (
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
                  className="rounded-t-none border-t-0"
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
          </li>
        ))}
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
    </li>
  );
};

export default RoutinesFormSection;
