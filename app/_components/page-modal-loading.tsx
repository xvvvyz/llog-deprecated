'use client';

import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import Spinner from '@/_components/spinner';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

interface LoadingProps {
  className?: string;
}

const PageModalLoading = ({ className }: LoadingProps) => (
  <Modal.Content className={className}>
    <div className="align-start flex justify-between px-4 py-6 sm:px-8">
      <Modal.Title className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
      <Modal.Close asChild>
        <IconButton
          className="relative right-1 top-0 shrink-0"
          icon={<XMarkIcon className="w-7" />}
          label="Close"
        />
      </Modal.Close>
    </div>
    <div className="pb-24 pt-16">
      <Spinner className="mx-auto" />
    </div>
  </Modal.Content>
);

export default PageModalLoading;
