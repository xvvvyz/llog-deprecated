'use client';

import Alert from '@/_components/alert';
import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import Select from '@/_components/select';
import TemplateSelect from '@/_components/template-select';
import CacheKeys from '@/_constants/enum-cache-keys';
import useBackLink from '@/_hooks/use-back-link';
import { GetSessionData } from '@/_server/get-session';
import { ListInputsData } from '@/_server/list-inputs';
import { ListTemplatesWithDataData } from '@/_server/list-templates-with-data';
import forceArray from '@/_utilities/force-array';
import formatCacheLink from '@/_utilities/format-cache-link';
import globalValueCache from '@/_utilities/global-value-cache';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';

import {
  Bars2Icon,
  DocumentTextIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface EventTypeFormSectionProps<T extends FieldValues> {
  attributes?: DraggableAttributes;
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesWithDataData;
  cacheKey: CacheKeys;
  event?: NonNullable<GetSessionData>['modules'][0]['event'][0];

  // todo: figure out how to type this
  eventTypeArray?: any;

  eventTypeIndex?: number;
  form: UseFormReturn<T>;
  hasOnlyOne?: boolean;
  isRedirecting?: boolean;
  listeners?: DraggableSyntheticListeners;
  namePrefix?: string;
  moduleNumber?: number;
}

const EventTypeFormSection = <T extends FieldValues>({
  attributes,
  availableInputs,
  availableTemplates,
  cacheKey,
  event,
  eventTypeArray,
  eventTypeIndex,
  form,
  hasOnlyOne,
  isRedirecting,
  listeners,
  moduleNumber,
  namePrefix = '',
}: EventTypeFormSectionProps<T>) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const [isTransitioning, startTransition] = useTransition();
  const backLink = useBackLink({ useCache: true });
  const router = useRouter();

  const saveAsTemplateButton = (
    <Button
      onClick={() => {
        const values = form.getValues((namePrefix || undefined) as T[string]);

        globalValueCache.set(CacheKeys.TemplateForm, {
          content: values.content,
          inputs: values.inputs,
          name: values.name,
        });

        globalValueCache.set(cacheKey, form.getValues());

        router.push(
          formatCacheLink({
            backLink,
            path: '/templates/create',
            useCache: true,
          }),
        );
      }}
      variant="link"
    >
      <DocumentTextIcon className="w-5" />
      Save as template
    </Button>
  );

  return (
    <>
      {attributes && listeners && (
        <IconButton
          className="m-0 w-full cursor-move touch-none justify-center bg-alpha-reverse-1 p-0 py-1 sm:rounded-t"
          icon={<Bars2Icon className="w-5" />}
          {...attributes}
          {...listeners}
        />
      )}
      <div
        className={twMerge(
          'flex flex-col gap-8 border-b border-alpha-1 px-4 py-8 sm:px-8',
          attributes && listeners && 'border-t border-alpha-1',
          event && 'pt-0',
        )}
      >
        {event && (
          <div className="smallcaps flex items-center gap-4 whitespace-nowrap pt-4 sm:rounded-t">
            <Avatar
              className="-my-[0.15rem]"
              id={event.profile?.id}
              size="xs"
            />
            {event.profile?.first_name} {event.profile?.last_name}
            <span className="ml-auto">Completed</span>
          </div>
        )}
        {moduleNumber && eventTypeArray && (
          <div className="-mt-1 flex items-center justify-between">
            <div className="font-mono text-fg-4">Module {moduleNumber}</div>
            <div className="flex gap-6">
              {saveAsTemplateButton}
              <Button
                disabled={hasOnlyOne}
                onClick={() => toggleDeleteAlert(true)}
                variant="link"
              >
                <TrashIcon className="w-5" />
                Delete
              </Button>
              <Alert
                confirmText="Delete module"
                isOpen={deleteAlert}
                onClose={toggleDeleteAlert}
                onConfirm={() => eventTypeArray.remove(eventTypeIndex)}
              />
            </div>
          </div>
        )}
        <TemplateSelect
          availableInputs={availableInputs}
          formSetValue={form.setValue}
          isMission={!!moduleNumber}
          namePrefix={namePrefix}
          templateOptions={availableTemplates}
        />
      </div>
      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        {!moduleNumber && (
          <Input
            label="Name"
            maxLength={49}
            required
            {...form.register(`${namePrefix}name` as T[string])}
          />
        )}
        <Controller
          control={form.control}
          name={`${namePrefix}content` as T[string]}
          render={({ field }) => (
            <RichTextarea
              key={field.name}
              label={moduleNumber ? undefined : 'Description'}
              placeholder={moduleNumber ? 'Instructions' : undefined}
              {...field}
            />
          )}
        />
        <Controller
          control={form.control}
          name={`${namePrefix}inputs` as T[string]}
          render={({ field }) => (
            <Select
              formatCreateLabel={(value: string) => `Create "${value}" input`}
              isCreatable
              isLoading={isTransitioning}
              isMulti
              label={moduleNumber ? undefined : 'Inputs'}
              name={field.name}
              noOptionsMessage={() => 'Type to create a new input'}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value)}
              onCreateOption={async (value: unknown) => {
                globalValueCache.set(CacheKeys.InputForm, { label: value });
                globalValueCache.set(cacheKey, form.getValues());

                startTransition(() =>
                  router.push(
                    formatCacheLink({
                      backLink,
                      path: '/inputs/create',
                      updateCacheKey: cacheKey,
                      updateCachePath: `${namePrefix}inputs`,
                      useCache: true,
                    }),
                  ),
                );
              }}
              options={forceArray(availableInputs)}
              placeholder="Select inputs or type to create…"
              tooltip={
                moduleNumber ? undefined : (
                  <>
                    Define the specific data points you are interested in
                    tracking for this event type. For example:
                    &ldquo;Duration&rdquo;, &ldquo;Rating&rdquo;, &ldquo;Body
                    language&rdquo;, etc.
                  </>
                )
              }
              value={field.value}
            />
          )}
        />
        {!moduleNumber && (
          <div className="flex flex-col items-center gap-8">
            <Button
              className="mt-8 w-full"
              loading={form.formState.isSubmitting || isRedirecting}
              loadingText="Saving…"
              type="submit"
            >
              Save event type
            </Button>
            {saveAsTemplateButton}
          </div>
        )}
      </div>
    </>
  );
};

export default EventTypeFormSection;
