'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import FormBanner from '@/_components/form-banner';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertEventType from '@/_mutations/upsert-event-type';
import { GetEventTypeWithInputsData } from '@/_queries/get-event-type-with-inputs';
import { GetInputData } from '@/_queries/get-input';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

interface EventTypeFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableTemplates: NonNullable<ListTemplatesWithDataData>;
  eventType?: NonNullable<GetEventTypeWithInputsData>;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  subjectId: string;
}

type EventTypeFormValues = {
  content: string;
  inputs: NonNullable<ListInputsBySubjectIdData>;
  name: string;
};

const EventTypeForm = ({
  availableInputs,
  availableTemplates,
  eventType,
  subjects,
  subjectId,
}: EventTypeFormProps) => {
  const [createInputModal, setCreateInputModal] =
    useState<Partial<GetInputData>>(null);

  const [isTransitioning, startTransition] = useTransition();
  const cacheKey = getFormCacheKey.eventType({ id: eventType?.id, subjectId });

  const form = useCachedForm<EventTypeFormValues>(cacheKey, {
    defaultValues: {
      content: eventType?.content ?? '',
      inputs: availableInputs.filter((input) =>
        eventType?.inputs?.some(({ input_id }) => input_id === input.id),
      ),
      name: eventType?.name ?? '',
    },
  });

  const inputsArray = useFieldArray({ control: form.control, name: 'inputs' });
  const router = useRouter();

  return (
    <>
      <form
        onSubmit={form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertEventType(
              { eventTypeId: eventType?.id, subjectId },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
              return;
            }

            localStorage.setItem('refresh', '1');
            router.back();
          }),
        )}
        className="divide-y divide-alpha-1"
      >
        <FormBanner<EventTypeFormValues>
          availableInputs={availableInputs}
          availableTemplates={availableTemplates}
          form={form}
        />
        <div className="flex flex-col gap-8 px-4 pb-8 pt-7 sm:px-8">
          <Input
            label="Name"
            maxLength={49}
            required
            {...form.register('name')}
          />
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => (
              <RichTextarea
                key={field.name}
                label="Description or instructions"
                {...field}
              />
            )}
          />
          <Controller
            control={form.control}
            name="inputs"
            render={({ field }) => (
              <Select
                formatCreateLabel={(value) => `Create "${value}" input`}
                isCreatable
                isMulti
                label="Inputs"
                name={field.name}
                noOptionsMessage={() => 'Type to create a new input'}
                onBlur={field.onBlur}
                onChange={field.onChange}
                onCreateOption={(value) =>
                  setCreateInputModal({
                    label: value,
                    subjects_for: [{ subject_id: subjectId }],
                  })
                }
                options={availableInputs as IOption[]}
                placeholder="Select inputs or type to create…"
                tooltip={
                  <>
                    Define the specific data points you are interested in
                    tracking for this event type. For example:
                    &ldquo;Duration&rdquo;, &ldquo;Rating&rdquo;, &ldquo;Body
                    language&rdquo;, etc.
                  </>
                }
                value={field.value as IOption[]}
              />
            )}
          />
        </div>
        {form.formState.errors.root && (
          <div className="px-4 py-8 text-center sm:px-8">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="flex gap-4 px-4 py-8 sm:px-8">
          <BackButton className="w-full" colorScheme="transparent">
            Close
          </BackButton>
          <Button
            className="w-full"
            loading={isTransitioning}
            loadingText="Saving…"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
      <Dialog
        onClose={() => setCreateInputModal(null)}
        open={!!createInputModal}
      >
        <div className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
        <div className="fixed inset-0 z-30 overflow-y-auto py-16">
          <div className="flex min-h-full items-start justify-center">
            <DialogPanel className="relative w-full max-w-lg divide-y divide-alpha-1 rounded border-y border-alpha-1 bg-bg-2 shadow-lg sm:border-x">
              <PageModalHeader
                onClose={() => setCreateInputModal(null)}
                title="Create input"
              />
              <InputForm
                disableCache
                input={createInputModal}
                onClose={() => setCreateInputModal(null)}
                onSubmit={(values) => {
                  inputsArray.append(values, { shouldFocus: true });
                  setCreateInputModal(null);
                  router.refresh();
                }}
                subjects={subjects}
              />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export type { EventTypeFormValues };
export default EventTypeForm;
