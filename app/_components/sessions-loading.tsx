import IconButton from '@/_components/icon-button';
import Spinner from '@/_components/spinner';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

const SessionsLoading = () => (
  <>
    <div className="my-16 flex h-8 items-center gap-8 px-4">
      <IconButton
        icon={<ArrowLeftIcon className="relative -left-[0.16em] w-7" />}
      />
      <div className="h-8 w-32 animate-pulse rounded-sm bg-alpha-3" />
    </div>
    <Spinner className="mx-auto" />
  </>
);

export default SessionsLoading;
