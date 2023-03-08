import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import Button from './button';

interface AlertProps {
  cancelText?: string;
  confirmText?: string;
  description?: ReactNode;
  onConfirm?: () => void;
  title?: string;
  toggle: () => void;
  value: boolean;
}

const Alert = ({
  cancelText = 'Cancel',
  confirmText = 'Yes, I am sure',
  description,
  onConfirm,
  title = 'Are you sure?',
  toggle,
  value,
}: AlertProps) => (
  <Transition appear as={Fragment} show={value}>
    <Dialog className="relative z-10" onClose={toggle} open={value}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-alpha-1 backdrop-blur-md" />
      </Transition.Child>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-xs transform rounded bg-bg-1 p-8 text-center shadow-lg transition-all">
              <Dialog.Title className="text-2xl">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="mt-2 leading-snug text-fg-3">
                  {description}
                </Dialog.Description>
              )}
              <div className="mt-16 flex flex-col-reverse gap-6">
                <Button
                  className="mx-0 block w-full text-center"
                  onClick={toggle}
                  variant="link"
                >
                  {cancelText}
                </Button>
                <Button
                  className="w-full"
                  colorScheme="red"
                  onClick={async () => {
                    if (onConfirm) await onConfirm();
                    toggle();
                  }}
                >
                  {confirmText}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default Alert;
