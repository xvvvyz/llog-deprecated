'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import Select, { IOption } from '@/_components/select';
import getTemplateData from '@/_queries/get-template-data';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import { EventTypeTemplateDataJson } from '@/_types/event-type-template-data-json';
import forceArray from '@/_utilities/force-array';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useTransition } from 'react';
import * as Form from 'react-hook-form';

interface EventTypeUseTemplateModalProps<T extends Form.FieldValues> {
  availableEventTypeTemplates: NonNullable<ListTemplatesBySubjectIdAndTypeData>;
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  form: Form.UseFormReturn<T>;
}

const EventTypeUseTemplateModal = <T extends Form.FieldValues>({
  availableEventTypeTemplates,
  availableInputs,
  form,
}: EventTypeUseTemplateModalProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const [open, toggleOpen] = useToggle(false);

  return (
    <Modal.Root onOpenChange={toggleOpen} open={open}>
      <Modal.Trigger asChild>
        <Button
          className="pr-2 sm:pr-6"
          onClick={() => toggleOpen()}
          variant="link"
        >
          <DocumentTextIcon className="w-5 text-fg-4" />
          Use template
        </Button>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content className="max-w-sm p-8 text-center">
            <Modal.Title className="text-2xl">Use template</Modal.Title>
            <Modal.Description className="mt-4 px-4 text-fg-4">
              Selecting a template will overwrite any existing event type
              values.
            </Modal.Description>
            <div className="pt-16 text-left">
              <Select
                isLoading={isTransitioning}
                noOptionsMessage={() => 'No templates.'}
                onChange={(t) =>
                  startTransition(async () => {
                    const template = t as NonNullable<
                      ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
                    >[0];

                    const { data: templateData } = await getTemplateData(
                      template.id,
                    );

                    const data =
                      templateData?.data as EventTypeTemplateDataJson;

                    const inputs = availableInputs.filter(({ id }) =>
                      forceArray(data?.inputIds).includes(id),
                    );

                    form.setValue(
                      'name' as Form.FieldPath<T>,
                      template.name as Form.PathValue<T, Form.FieldPath<T>>,
                      { shouldDirty: true },
                    );

                    form.setValue(
                      'content' as Form.FieldPath<T>,
                      (data?.content ?? '') as Form.PathValue<
                        T,
                        Form.FieldPath<T>
                      >,
                      { shouldDirty: true },
                    );

                    form.setValue(
                      'inputs' as Form.FieldPath<T>,
                      inputs as Form.PathValue<T, Form.FieldPath<T>>,
                      { shouldDirty: true },
                    );

                    toggleOpen();
                  })
                }
                options={availableEventTypeTemplates as IOption[]}
                placeholder="Select a template…"
                value={null}
              />
            </div>
            <Modal.Close asChild onClick={(e) => e.preventDefault()}>
              <Button
                className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                onClick={() => toggleOpen()}
                variant="link"
              >
                Close
              </Button>
            </Modal.Close>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
};

export default EventTypeUseTemplateModal;
