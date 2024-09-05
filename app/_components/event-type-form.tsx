'use client';

import Button from '@/_components/button';
import EventTypeUseTemplateModal from '@/_components/event-type-use-template-modal';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import * as Modal from '@/_components/modal';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertEventType from '@/_mutations/upsert-event-type';
import { GetEventTypeWithInputsData } from '@/_queries/get-event-type-with-inputs';
import { GetInputData } from '@/_queries/get-input';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

interface EventTypeFormProps {
  availableEventTypeTemplates: NonNullable<ListTemplatesBySubjectIdAndTypeData>;
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  eventType?: NonNullable<GetEventTypeWithInputsData>;
  subjectId: string;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

export type EventTypeFormValues = {
  content: string;
  inputs: NonNullable<ListInputsBySubjectIdData>;
  name: string;
};

const EventTypeForm = ({
  availableEventTypeTemplates,
  availableInputs,
  eventType,
  subjectId,
  subjects,
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
    <Modal.Content>
      <PageModalHeader
        right={
          <EventTypeUseTemplateModal<EventTypeFormValues>
            availableEventTypeTemplates={availableEventTypeTemplates}
            availableInputs={availableInputs}
            form={form}
          />
        }
        title={eventType?.id ? 'Edit event type' : 'New event type'}
      />
      <form
        className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
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

            router.back();
          }),
        )}
      >
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
        <Modal.Root
          onOpenChange={() => setCreateInputModal(null)}
          open={!!createInputModal}
        >
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
                noOptionsMessage={() => 'Type to create a new input.'}
                onBlur={field.onBlur}
                onChange={field.onChange}
                onCreateOption={(value) =>
                  setCreateInputModal({
                    label: value,
                    subjects: [{ id: subjectId }],
                  })
                }
                options={availableInputs as IOption[]}
                placeholder="Select inputs or type to create…"
                tooltip={
                  <>
                    Define the specific data points you are interested in
                    tracking and creating insights for.
                  </>
                }
                value={field.value as IOption[]}
              />
            )}
          />
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Content>
                <PageModalHeader
                  onClose={() => setCreateInputModal(null)}
                  title="New input"
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
              </Modal.Content>
            </Modal.Overlay>
          </Modal.Portal>
        </Modal.Root>
        {form.formState.errors.root && (
          <div className="text-center">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="flex gap-4 pt-8">
          <PageModalBackButton className="w-full" colorScheme="transparent">
            Close
          </PageModalBackButton>
          <Button
            className="w-full"
            loading={isTransitioning}
            loadingText="Saving…"
            type="submit"
          >
            Save
          </Button>
        </div>
        <UnsavedChangesBanner<EventTypeFormValues> form={form} />
      </form>
    </Modal.Content>
  );
};

export default EventTypeForm;
