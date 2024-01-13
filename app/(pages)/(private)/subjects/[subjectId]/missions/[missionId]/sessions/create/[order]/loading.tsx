import BackButton from '@/_components/back-button';
import IconButton from '@/_components/icon-button';
import Spinner from '@/_components/spinner';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Loading = () => (
  <div className="px-4">
    <div className="my-16 flex h-8 items-center justify-between gap-8">
      <BackButton disabled />
      <div className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
    </div>
    <nav className="flex w-full items-center justify-between">
      <IconButton
        disabled
        icon={<ChevronLeftIcon className="relative -left-2 w-7" />}
      />
      <div className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
      <IconButton
        disabled
        icon={<ChevronRightIcon className="relative -right-2 w-7" />}
      />
    </nav>
    <Spinner className="mx-auto mt-8" />
  </div>
);

export default Loading;
