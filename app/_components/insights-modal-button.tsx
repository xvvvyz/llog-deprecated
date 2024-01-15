'use client';

import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Plots from '@/_components/plots';
import { Dialog } from '@headlessui/react';
import { ChartBarSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToggle } from '@uidotdev/usehooks';

interface InsightsModalButtonProps {
  isPublic?: boolean;
  subjectId: string;
}

const InsightsModalButton = ({
  isPublic,
  subjectId,
}: InsightsModalButtonProps) => {
  const [modal, toggleModal] = useToggle(false);

  return (
    <>
      <Button onClick={() => toggleModal(true)} variant="link">
        <ChartBarSquareIcon className="w-5" />
        Insights
      </Button>
      <Dialog className="relative z-10" onClose={toggleModal} open={modal}>
        <Dialog.Backdrop className="fixed inset-0 bg-bg-1" />
        <div className="fixed inset-0 overflow-y-auto">
          <Dialog.Panel className="min-h-full w-full space-y-24 bg-bg-1 p-8 md:p-16 lg:p-24">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl">Insights</Dialog.Title>
              <IconButton
                icon={<XMarkIcon className="relative -right-[0.16em] w-7" />}
                onClick={() => toggleModal(false)}
              />
            </div>
            <Plots isPublic={isPublic} subjectId={subjectId} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default InsightsModalButton;
