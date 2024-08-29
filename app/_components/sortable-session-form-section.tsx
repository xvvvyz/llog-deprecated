'use client';

import Button from '@/_components/button';
import * as Collapsible from '@/_components/collapsible';
import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import Select from '@/_components/select';
import SessionTemplateForm from '@/_components/session-template-form';
import { GetTemplateData } from '@/_queries/get-template';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import forceArray from '@/_utilities/force-array';
import { useSortable } from '@dnd-kit/sortable';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Form from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import SessionFormSection, {
  SessionFormSectionProps,
} from '@/_components/session-form-section';
import { TrainingPlanTemplateFormValues } from '@/_components/training-plan-template-form';
import { SessionTemplateDataJson } from '@/_types/session-template-data-json';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';

interface SortableSessionFormSectionProps<
  T extends Form.FieldValues,
  U extends Form.ArrayPath<T>,
> extends SessionFormSectionProps<T> {
  availableSessionTemplates: NonNullable<ListTemplatesWithDataData>;
  sessionArray: Form.UseFieldArrayReturn<T, U, 'key'>;
  sessionIndex: number;
  sessionKey: string;
}

const SortableSessionFormSection = <
  T extends Form.FieldValues,
  U extends Form.ArrayPath<T>,
>({
  availableSessionTemplates,
  sessionArray,
  sessionIndex,
  sessionKey,
  ...rest
}: SortableSessionFormSectionProps<T, U>) => {
  const [createTemplateModal, setCreateTemplateModal] =
    useState<Partial<GetTemplateData>>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [useTemplateModal, toggleUseTemplateModal] = useToggle(false);
  const router = useRouter();

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sessionKey });

  const title = rest.form.watch(`${rest.fieldPath}.title` as Form.Path<T>);

  return (
    <li
      className={twMerge(
        'border-y border-alpha-1 bg-bg-2',
        isDragging && 'relative z-10 drop-shadow-2xl',
      )}
      ref={setNodeRef}
      style={{
        transform: transform
          ? isDragging
            ? `translate(${transform.x}px, ${transform.y}px) scale(1.03)`
            : `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition,
      }}
    >
      <Collapsible.Root onOpenChange={setIsOpen} open={isOpen}>
        <div className="flex px-4 transition-colors hover:bg-alpha-1 sm:px-8">
          <IconButton
            className="m-0 mr-2 h-full cursor-ns-resize touch-none px-4"
            icon={<Bars2Icon className="w-5" />}
            {...attributes}
            {...listeners}
          />
          <Collapsible.Trigger asChild>
            <Button
              colorScheme="transparent"
              className="m-0 w-full min-w-0 justify-between gap-6 p-0 text-left"
              variant="link"
            >
              <div className="min-w-0">
                <div className="truncate leading-snug">
                  Session {sessionIndex + 1}
                  {title ? `: ${title}` : ''}
                </div>
              </div>
              {isOpen ? (
                <ChevronUpIcon className="mr-2 w-5 shrink-0" />
              ) : (
                <ChevronDownIcon className="mr-2 w-5 shrink-0" />
              )}
            </Button>
          </Collapsible.Trigger>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <div className="group -mr-1 flex items-center justify-center p-1 text-fg-3 transition-colors hover:text-fg-2">
                <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
                  <EllipsisVerticalIcon className="w-5" />
                </div>
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Button
                  onClick={() => {
                    const session = rest.form.getValues(
                      `${rest.fieldPath}` as Form.Path<T>,
                    );

                    sessionArray.insert(sessionIndex + 1, session);
                  }}
                >
                  <DocumentDuplicateIcon className="w-5 text-fg-4" />
                  Duplicate
                </DropdownMenu.Button>
                <DropdownMenu.Separator />
                <DropdownMenu.Button
                  onClick={() =>
                    sessionArray.insert(sessionIndex, {
                      modules: [{ content: '', inputs: [], name: '' }],
                      title: '',
                    } as Form.FieldValue<T>)
                  }
                >
                  <ArrowUpIcon className="w-5 text-fg-4" />
                  Add session above
                </DropdownMenu.Button>
                <DropdownMenu.Button
                  onClick={() =>
                    sessionArray.insert(sessionIndex + 1, {
                      modules: [{ content: '', inputs: [], name: '' }],
                      title: '',
                    } as Form.FieldValue<T>)
                  }
                >
                  <ArrowDownIcon className="w-5 text-fg-4" />
                  Add session below
                </DropdownMenu.Button>
                <DropdownMenu.Separator />
                <Modal.Root
                  onOpenChange={toggleUseTemplateModal}
                  open={useTemplateModal}
                >
                  <Modal.Trigger asChild>
                    <DropdownMenu.Button
                      onClick={() => toggleUseTemplateModal()}
                    >
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
                          Selecting a template will overwrite any existing
                          module values.
                        </Modal.Description>
                        <div className="pt-16 text-left">
                          <Select
                            noOptionsMessage={() => 'No templates.'}
                            onChange={(t) => {
                              const template =
                                t as NonNullable<ListTemplatesWithDataData>[0];

                              const data =
                                template?.data as SessionTemplateDataJson;

                              rest.form.setValue(
                                `${rest.fieldPath}.title` as Form.Path<T>,
                                template?.name as Form.PathValue<
                                  T,
                                  Form.Path<T>
                                >,
                                { shouldDirty: true },
                              );

                              rest.form.setValue(
                                `${rest.fieldPath}.modules` as Form.Path<T>,
                                data?.modules?.map((module) => ({
                                  content: module.content,
                                  inputs: rest.availableInputs.filter(
                                    ({ id }) =>
                                      forceArray(module?.inputIds).includes(id),
                                  ),
                                  name: module.name,
                                })) as Form.PathValue<T, Form.Path<T>>,
                                { shouldDirty: true },
                              );

                              toggleUseTemplateModal();
                            }}
                            options={availableSessionTemplates}
                            placeholder="Select a template…"
                            value={null}
                          />
                        </div>
                        <Modal.Close
                          asChild
                          onClick={(e) => e.preventDefault()}
                        >
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
                        const { modules, title } = rest.form.getValues(
                          rest.fieldPath as Form.Path<T>,
                        ) as TrainingPlanTemplateFormValues['sessions'][0];

                        setCreateTemplateModal({
                          data: {
                            modules: modules.map((module) => ({
                              content: module.content,
                              inputIds: module.inputs.map(({ id }) => id),
                              name: module.name,
                            })),
                          },
                          name: title,
                        });
                      }}
                    >
                      <PlusIcon className="w-5 text-fg-4" />
                      New template
                    </DropdownMenu.Button>
                  </Modal.Trigger>
                  <Modal.Portal>
                    <Modal.Overlay>
                      <Modal.Content>
                        <PageModalHeader
                          onClose={() => setCreateTemplateModal(null)}
                          title="New session template"
                        />
                        <SessionTemplateForm
                          availableInputs={rest.availableInputs}
                          availableModuleTemplates={
                            rest.availableModuleTemplates
                          }
                          disableCache
                          onClose={() => setCreateTemplateModal(null)}
                          onSubmit={() => {
                            setCreateTemplateModal(null);
                            router.refresh();
                          }}
                          subjects={rest.subjects}
                          template={createTemplateModal}
                        />
                      </Modal.Content>
                    </Modal.Overlay>
                  </Modal.Portal>
                </Modal.Root>
                <DropdownMenu.Separator />
                <DropdownMenuDeleteItem
                  confirmText="Delete session"
                  onConfirm={() => sessionArray.remove(sessionIndex)}
                />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <Collapsible.Content className="space-y-8 px-4 pb-16 pt-10 sm:px-8">
          <SessionFormSection<T> {...rest} />
        </Collapsible.Content>
      </Collapsible.Root>
    </li>
  );
};

export default SortableSessionFormSection;
