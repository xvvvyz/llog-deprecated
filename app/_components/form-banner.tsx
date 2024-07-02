'use client';

import Button from '@/_components/button';
import Select from '@/_components/select';
import Tip from '@/_components/tip';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { TemplateDataJson } from '@/_types/template-data-json';
import forceArray from '@/_utilities/force-array';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import EllipsisHorizontalIcon from '@heroicons/react/24/outline/EllipsisHorizontalIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import { useToggle } from '@uidotdev/usehooks';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import DropdownMenu from '@/_components/dropdown-menu';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

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
      <div className="flex items-center gap-2">
        <Tip align="center" tipClassName="max-w-[18rem]" side="right">
          Unsaved changes are stored locally on your device until you save or
          discard them.
        </Tip>
        <span className="smallcaps text-fg-4">
          {form.formState.isDirty ? 'Unsaved changes' : 'No unsaved changes'}
        </span>
      </div>
      <DropdownMenu
        trigger={
          <div className="group flex h-full items-center justify-center text-fg-3 hover:text-fg-2">
            <div className="rounded-full p-2 group-hover:bg-alpha-1">
              <EllipsisHorizontalIcon className="w-5" />
            </div>
          </div>
        }
      >
        <DropdownMenu.Content className="-mt-10">
          {useTemplateEnabled && (
            <DropdownMenu.Button onClick={() => toggleUseTemplateModal()}>
              <DocumentTextIcon className="w-5 text-fg-4" />
              Use template
            </DropdownMenu.Button>
          )}
          <DropdownMenu.Button
            disabled={!form.formState.isDirty}
            onClick={() => form.reset()}
          >
            <XCircleIcon className="w-5 text-fg-4" />
            Discard changes
          </DropdownMenu.Button>
        </DropdownMenu.Content>
      </DropdownMenu>
      {useTemplateEnabled && (
        <Dialog onClose={toggleUseTemplateModal} open={useTemplateModal}>
          <div className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
          <div className="fixed inset-0 z-30 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <DialogPanel className="w-full max-w-sm rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg">
                <DialogTitle className="text-2xl">Use template</DialogTitle>
                <Description className="mt-4 px-4 text-fg-4">
                  Selecting a template will overwrite any existing event type
                  values.
                </Description>
                <Select
                  className="mt-16 text-left"
                  instanceId="template-select"
                  noOptionsMessage={() => 'No templates.'}
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
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default FormBanner;
