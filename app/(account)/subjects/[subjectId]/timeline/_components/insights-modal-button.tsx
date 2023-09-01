'use client';

import Charts from '@/(account)/subjects/[subjectId]/timeline/_components/charts';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import { Dialog } from '@headlessui/react';
import { ChartBarSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToggle } from '@uidotdev/usehooks';

interface InsightsModalButtonProps {
  subjectId: string;
}

const InsightsModalButton = ({ subjectId }: InsightsModalButtonProps) => {
  const [modal, toggleModal] = useToggle(false);

  return (
    <>
      <Button
        colorScheme="transparent"
        onClick={() => toggleModal(true)}
        size="sm"
      >
        <ChartBarSquareIcon className="w-5" />
        Insights
      </Button>
      <Dialog className="relative z-10" onClose={toggleModal} open={modal}>
        <div className="fixed inset-0 overflow-y-auto">
          <Dialog.Panel className="min-h-full w-full space-y-24 bg-bg-1 p-8 md:p-16 lg:p-24">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl">Insights</h1>
              <IconButton
                icon={<XMarkIcon className="relative -right-[0.16em] w-7" />}
                onClick={() => toggleModal(false)}
              />
            </div>
            <Charts subjectId={subjectId} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default InsightsModalButton;
