'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import Select, { IOption } from '@/_components/select';
import getTemplateData from '@/_queries/get-template-data';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import { SessionTemplateDataJson } from '@/_types/session-template-data-json';
import { useToggle } from '@uidotdev/usehooks';
import { ReactNode, useTransition } from 'react';
import * as Form from 'react-hook-form';

interface SessionUseTemplateModalProps<T extends Form.FieldValues> {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableSessionTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  fieldPath?: Form.FieldPath<T>;
  form: Form.UseFormReturn<T>;
  trigger: ReactNode;
}

const SessionUseTemplateModal = <T extends Form.FieldValues>({
  availableInputs,
  availableSessionTemplates,
  fieldPath,
  form,
  trigger,
}: SessionUseTemplateModalProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const [open, toggleOpen] = useToggle(false);

  const titleFieldPath = (
    fieldPath ? `${fieldPath}.title` : 'title'
  ) as Form.FieldPath<T>;

  const modulesFieldPath = (
    fieldPath ? `${fieldPath}.modules` : 'modules'
  ) as Form.FieldPath<T>;

  return (
    <Modal.Root onOpenChange={toggleOpen} open={open}>
      {trigger}
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content className="max-w-sm p-8 text-center">
            <Modal.Title className="text-2xl">Use template</Modal.Title>
            <Modal.Description className="mt-4 px-4 text-fg-4">
              Selecting a template will overwrite any existing session modules.
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

                    const data = templateData?.data as SessionTemplateDataJson;

                    form.setValue(
                      titleFieldPath,
                      template.name as Form.PathValue<T, Form.Path<T>>,
                      { shouldDirty: true },
                    );

                    form.setValue(
                      modulesFieldPath,
                      (data?.modules ?? []).map((module) => ({
                        content: module.content ?? '',
                        inputs: availableInputs.filter((input) =>
                          module.inputIds?.some((id) => id === input.id),
                        ),
                        name: module.name,
                      })) as Form.PathValue<T, Form.Path<T>>,
                      { shouldDirty: true },
                    );

                    toggleOpen();
                  })
                }
                options={availableSessionTemplates as IOption[]}
                placeholder="Select a template…"
                value={null}
              />
            </div>
            <Modal.Close asChild>
              <Button
                className="-mb-3 mt-14 w-full justify-center p-0 py-3"
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

export default SessionUseTemplateModal;
