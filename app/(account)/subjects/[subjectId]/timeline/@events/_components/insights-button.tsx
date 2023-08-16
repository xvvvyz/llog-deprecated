'use client';

import IconButton from '@/(account)/_components/icon-button';
import ChatForm from '@/(account)/subjects/[subjectId]/timeline/@events/_components/chat-form';
import Button from '@/_components/button';
import { Dialog } from '@headlessui/react';
import { ChartBarSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/gotrue-js/src/lib/types';
import { useBoolean } from 'usehooks-ts';

interface InsightsButtonProps {
  disabled?: boolean;
  subjectId: string;
  user: User;
}

const InsightsButton = ({ disabled, subjectId, user }: InsightsButtonProps) => {
  const modal = useBoolean();

  return (
    <>
      <Button
        colorScheme="transparent"
        className="rounded-r-none border-r-0"
        disabled={disabled}
        onClick={modal.setTrue}
        size="sm"
      >
        <ChartBarSquareIcon className="w-5" />
        Insights
      </Button>
      <Dialog
        className="relative z-10"
        onClose={modal.setFalse}
        open={modal.value}
      >
        <div className="fixed inset-0 bg-alpha-reverse-2 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative w-full max-w-xl transform rounded border border-alpha-1 bg-bg-2 px-4 py-8 shadow-lg transition-all sm:px-8">
              <ChatForm subjectId={subjectId} user={user} />
              <IconButton
                className="absolute right-4 top-4"
                colorScheme="transparent"
                icon={<XMarkIcon className="w-7" />}
                onClick={modal.setFalse}
                size="sm"
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default InsightsButton;
