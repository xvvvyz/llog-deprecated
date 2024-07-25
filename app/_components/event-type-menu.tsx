'use client';

import Alert from '@/_components/alert';
import Button from '@/_components/button';
import DropdownMenu from '@/_components/dropdown-menu';
import IconButton from '@/_components/icon-button';
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
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

interface EventTypeMenuProps<T extends FieldValues> {
  availableInputs?: NonNullable<ListInputsBySubjectIdData>;
  availableTemplates?: NonNullable<ListTemplatesWithDataData>;
  eventTypeId?: string;
  form?: UseFormReturn<T>;
  isView?: boolean;
  subjectId: string;
  subjects?: NonNullable<ListSubjectsByTeamIdData>;
}

const EventTypeMenu = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  eventTypeId,
  form,
  isView,
  subjectId,
  subjects,
}: EventTypeMenuProps<T>) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  const [createTemplateModal, setCreateTemplateModal] =
    useState<Partial<GetTemplateData>>(null);

  const [useTemplateModal, toggleUseTemplateModal] = useToggle(false);

  const router = useRouter();

  return (
    <>
      <DropdownMenu
        trigger={
          form || isView ? (
            <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
          ) : (
            <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
              <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
                <EllipsisVerticalIcon className="w-5" />
              </div>
            </div>
          )
        }
      >
        <DropdownMenu.Content
          className={form || isView ? '-mr-[3.7rem] -mt-14' : '-mt-12 mr-1.5'}
        >
          {form && (
            <>
              <DropdownMenu.Button onClick={() => toggleUseTemplateModal()}>
                <DocumentTextIcon className="w-5 text-fg-4" />
                Use template
              </DropdownMenu.Button>
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
              <DropdownMenu.Button onClick={() => toggleDeleteAlert(true)}>
                <TrashIcon className="w-5 text-fg-4" />
                Delete
              </DropdownMenu.Button>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
      {form && availableInputs && availableTemplates && subjects && (
        <>
          <Dialog onClose={toggleUseTemplateModal} open={useTemplateModal}>
            <div className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
            <div className="fixed inset-0 z-30 overflow-y-auto p-4">
              <div className="flex min-h-full items-center justify-center">
                <DialogPanel className="w-full max-w-sm rounded border border-alpha-1 bg-bg-2 p-8 text-center drop-shadow-2xl">
                  <DialogTitle className="text-2xl">Use template</DialogTitle>
                  <Description className="mt-4 px-4 text-fg-4">
                    Selecting a template will overwrite any existing event type
                    values.
                  </Description>
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
                  <Button
                    className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                    onClick={() => toggleUseTemplateModal()}
                    variant="link"
                  >
                    Close
                  </Button>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
          <Dialog
            onClose={() => setCreateTemplateModal(null)}
            open={!!createTemplateModal}
          >
            <div className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
            <div className="fixed inset-0 z-30 overflow-y-auto py-16">
              <div className="flex min-h-full items-start justify-center">
                <DialogPanel className="relative w-full max-w-lg rounded border-y border-alpha-1 bg-bg-2 drop-shadow-2xl sm:border-x">
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
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </>
      )}
      {eventTypeId && (
        <Alert
          confirmText="Delete event type"
          isConfirmingText="Deleting…"
          isOpen={deleteAlert}
          onClose={toggleDeleteAlert}
          onConfirm={() => {
            void deleteEventType(eventTypeId);
            if (form || isView) router.replace(`/subjects/${subjectId}`);
          }}
        />
      )}
    </>
  );
};

export default EventTypeMenu;
