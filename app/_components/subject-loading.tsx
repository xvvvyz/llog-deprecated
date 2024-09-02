import IconButton from '@/_components/icon-button';
import Spinner from '@/_components/spinner';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

interface SubjectLoadingProps {
  isPublic?: boolean;
}

const SubjectLoading = ({ isPublic }: SubjectLoadingProps) => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-4 sm:gap-6">
        {!isPublic && (
          <IconButton
            className="-ml-3.5"
            href="/subjects"
            icon={<ArrowLeftIcon className="w-7" />}
            label="Back"
          />
        )}
        <div className="h-8 w-32 animate-pulse rounded-sm bg-alpha-3" />
      </div>
      <div className="h-8 w-8 animate-pulse rounded-sm bg-alpha-3" />
    </div>
    <Spinner className="mx-auto" />
  </>
);

export default SubjectLoading;
