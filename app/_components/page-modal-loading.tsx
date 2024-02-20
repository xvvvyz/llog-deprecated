'use client';

import IconButton from '@/_components/icon-button';
import Spinner from '@/_components/spinner';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useSearchParams } from 'next/navigation';

const PageModalLoading = () => {
  const searchParams = useSearchParams();

  return (
    <>
      <div className="flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
        <IconButton
          className="relative right-1 shrink-0"
          href={searchParams.get('back') || undefined}
          icon={<XMarkIcon className="w-7" />}
        />
      </div>
      <div className="py-24">
        <Spinner className="mx-auto" />
      </div>
    </>
  );
};

export default PageModalLoading;
