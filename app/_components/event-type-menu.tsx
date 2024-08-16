'use client';

import Button from '@/_components/button';
import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import Select from '@/_components/select';
import TemplateForm from '@/_components/template-form';
import deleteEventType from '@/_mutations/delete-event-type';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { TemplateDataJson } from '@/_types/template-data-json';
import forceArray from '@/_utilities/force-array';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

interface EventTypeMenuProps<T extends FieldValues> {
  availableInputs?: NonNullable<ListInputsBySubjectIdData>;
  availableTemplates?: NonNullable<ListTemplatesWithDataData>;
  eventTypeId?: string;
  form?: UseFormReturn<T>;
  isModal?: boolean;
  subjectId: string;
  subjects?: NonNullable<ListSubjectsByTeamIdData>;
}

const EventTypeMenu = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  eventTypeId,
  form,
  isModal,
  subjectId,
  subjects,
}: EventTypeMenuProps<T>) => {
  const [createTemplateModal, setCreateTemplateModal] =
    useState<Partial<GetTemplateData>>(null);

  const [useTemplateModal, toggleUseTemplateModal] = useToggle(false);
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {form || isModal ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
            <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={form || isModal ? '-mr-[3.7rem]' : 'mr-1.5'}
        >
          {form && availableInputs && subjects && (
            <>
              <Modal.Root
                onOpenChange={toggleUseTemplateModal}
                open={useTemplateModal}
              >
                <Modal.Trigger asChild>
                  <DropdownMenu.Button onClick={() => toggleUseTemplateModal()}>
                    <DocumentTextIcon className="w-5 text-fg-4" />
                    Use template
                  </DropdownMenu.Button>
                </Modal.Trigger>
                <Modal.Portal>
                  <Modal.Overlay>
                    <Modal.Content className="max-w-sm p-8 text-center">
                      <Modal.Title className="text-2xl">
                        Use template
                      </Modal.Title>
                      <Modal.Description className="mt-4 px-4 text-fg-4">
                        Selecting a template will overwrite any existing event
                        type values.
                      </Modal.Description>
                      <div className="pt-16 text-left">
                        <Select
                          instanceId="template-select"
                          noOptionsMessage={() => 'No templates.'}
                          onChange={(t) => {
                            const template =
                              t as NonNullable<ListTemplatesWithDataData>[0];

                            const data = template?.data as TemplateDataJson;

                            const inputs = availableInputs.filter(({ id }) =>
                              forceArray(data?.inputIds).includes(id),
                            ) as PathValue<T, T[string]>;

                            form.setValue(
                              'name' as Path<T>,
                              template?.name as PathValue<T, Path<T>>,
                              { shouldDirty: true },
                            );

                            form.setValue(
                              'content' as Path<T>,
                              data?.content as PathValue<T, Path<T>>,
                              { shouldDirty: true },
                            );

                            form.setValue(
                              'inputs' as Path<T>,
                              inputs as PathValue<T, Path<T>>,
                              { shouldDirty: true },
                            );

                            toggleUseTemplateModal();
                          }}
                          options={availableTemplates}
                          placeholder="Select a template…"
                          value={null}
                        />
                      </div>
                      <Modal.Close asChild onClick={(e) => e.preventDefault()}>
                        <Button
                          className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                          onClick={() => toggleUseTemplateModal()}
                          variant="link"
                        >
                          Close
                        </Button>
                      </Modal.Close>
                    </Modal.Content>
                  </Modal.Overlay>
                </Modal.Portal>
              </Modal.Root>
              <Modal.Root
                onOpenChange={() => setCreateTemplateModal(null)}
                open={!!createTemplateModal}
              >
                <Modal.Trigger asChild onClick={(e) => e.preventDefault()}>
                  <DropdownMenu.Button
                    onClick={() => {
                      const { content, inputs, name } = form.getValues();

                      setCreateTemplateModal({
                        data: {
                          content,
                          inputIds: inputs.map(({ id }: { id: string }) => id),
                        },
                        name,
                      });
                    }}
                  >
                    <DocumentDuplicateIcon className="w-5 text-fg-4" />
                    New template
                  </DropdownMenu.Button>
                </Modal.Trigger>
                <Modal.Portal>
                  <Modal.Overlay>
                    <Modal.Content>
                      <PageModalHeader
                        onClose={() => setCreateTemplateModal(null)}
                        title="New template"
                      />
                      <TemplateForm
                        availableInputs={availableInputs}
                        disableCache
                        onClose={() => setCreateTemplateModal(null)}
                        onSubmit={() => {
                          setCreateTemplateModal(null);
                          router.refresh();
                        }}
                        subjects={subjects}
                        template={createTemplateModal}
                      />
                    </Modal.Content>
                  </Modal.Overlay>
                </Modal.Portal>
              </Modal.Root>
            </>
          )}
          {eventTypeId && (
            <>
              {!form && (
                <>
                  <DropdownMenu.Button
                    href={`/subjects/${subjectId}/event-types/${eventTypeId}/edit`}
                    scroll={false}
                  >
                    <PencilIcon className="w-5 text-fg-4" />
                    Edit
                  </DropdownMenu.Button>
                  <DropdownMenu.Button
                    href={`/templates/create/from-event-type/${eventTypeId}`}
                    scroll={false}
                  >
                    <DocumentDuplicateIcon className="w-5 text-fg-4" />
                    New template
                  </DropdownMenu.Button>
                </>
              )}
              <DropdownMenuDeleteItem
                confirmText="Delete event type"
                onConfirm={async () => {
                  await deleteEventType(eventTypeId);
                  if (form || isModal) router.back();
                }}
              />
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default EventTypeMenu;
