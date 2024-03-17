import IconButton from '@/_components/icon-button';
import Spinner from '@/_components/spinner';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

const SubjectLoading = () => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <div className="flex items-center gap-6">
        <IconButton
          icon={<ArrowLeftIcon className="relative -left-[0.16em] w-7" />}
        />
        <div className="h-8 w-32 animate-pulse rounded-sm bg-alpha-3" />
      </div>
      <div className="h-8 w-8 animate-pulse rounded-sm bg-alpha-3" />
    </div>
    <Spinner className="mx-auto" />
  </>
);

export default SubjectLoading;
