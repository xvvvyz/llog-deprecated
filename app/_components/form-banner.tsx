'use client';

import Button from '@/_components/button';
import Menu from '@/_components/menu';
import Select from '@/_components/select';
import Tooltip from '@/_components/tooltip';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { TemplateDataJson } from '@/_types/template-data-json';
import forceArray from '@/_utilities/force-array';
import { Dialog } from '@headlessui/react';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import EllipsisHorizontalIcon from '@heroicons/react/24/outline/EllipsisHorizontalIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import { useToggle } from '@uidotdev/usehooks';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface FormChangedBannerProps<T extends FieldValues> {
  availableInputs?: NonNullable<ListInputsBySubjectIdData>;
  availableTemplates?: NonNullable<ListTemplatesWithDataData>;
  className?: string;
  form: UseFormReturn<T>;
}

const FormBanner = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  className,
  form,
}: FormChangedBannerProps<T>) => {
  const [useTemplateModal, toggleUseTemplateModal] = useToggle(false);
  const useTemplateEnabled = availableInputs && availableTemplates;

  return (
    <div
      className={twMerge(
        'flex items-center justify-between px-4 py-2 sm:px-8',
        className,
      )}
    >
      <div className="flex items-center gap-2 pl-2">
        <Tooltip
          id="form-changed-banner-tip"
          placement="bottom-start"
          tip="Unsaved changes are stored locally on your device until you save or discard them."
          tipClassName="max-w-[14rem]"
        />
        <span className="smallcaps text-fg-4">
          {form.formState.isDirty ? 'Unsaved changes' : 'No unsaved changes'}
        </span>
      </div>
      <Menu>
        <Menu.Button className="group flex h-full items-center justify-center text-fg-3 hover:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisHorizontalIcon className="w-5" />
          </div>
        </Menu.Button>
        <Menu.Items className="mr-2 mt-2">
          {useTemplateEnabled && (
            <Menu.Item onClick={() => toggleUseTemplateModal()}>
              <DocumentTextIcon className="w-5 text-fg-4" />
              Use template
            </Menu.Item>
          )}
          <Menu.Item
            disabled={!form.formState.isDirty}
            onClick={() => form.reset()}
          >
            <XCircleIcon className="w-5 text-fg-4" />
            Discard changes
          </Menu.Item>
        </Menu.Items>
      </Menu>
      {useTemplateEnabled && (
        <Dialog onClose={toggleUseTemplateModal} open={useTemplateModal}>
          <Dialog.Backdrop className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
          <div className="fixed inset-0 z-30 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="w-full max-w-sm rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg">
                <Dialog.Title className="text-2xl">Use template</Dialog.Title>
                <Dialog.Description className="mt-4 px-4 text-fg-4">
                  Selecting a template will overwrite any existing event type
                  values.
                </Dialog.Description>
                <Select
                  className="mt-16 text-left"
                  instanceId="template-select"
                  noOptionsMessage={() => 'No templates'}
                  onChange={(t) => {
                    const template = (
                      t as NonNullable<ListTemplatesWithDataData>[0]
                    ).data as TemplateDataJson;

                    const inputs = availableInputs.filter(({ id }) =>
                      forceArray(template?.inputIds).includes(id),
                    ) as PathValue<T, T[string]>;

                    form.setValue(
                      'content' as Path<T>,
                      template?.content as PathValue<T, Path<T>>,
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
                <Button
                  className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                  onClick={() => toggleUseTemplateModal()}
                  variant="link"
                >
                  Close
                </Button>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default FormBanner;
