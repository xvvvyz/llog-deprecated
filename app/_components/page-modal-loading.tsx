'use client';

import BackIconButton from '@/_components/back-icon-button';
import Spinner from '@/_components/spinner';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

interface PageModalLoadingProps {
  className?: string;
}

const PageModalLoading = ({ className }: PageModalLoadingProps) => (
  <div className={className}>
    <div className="align-start flex justify-between px-4 py-8 sm:px-8">
      <div className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
      <BackIconButton
        className="relative -top-0.5 right-1 shrink-0"
        icon={<XMarkIcon className="w-7" />}
      />
    </div>
    <div className="pb-24 pt-16">
      <Spinner className="mx-auto" />
    </div>
  </div>
);

export default PageModalLoading;
