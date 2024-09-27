import Spinner from '@/_components/spinner';

const SubjectLoading = () => (
  <>
    <div className="flex items-center justify-between px-4 py-16">
      <div className="h-8 w-32 animate-pulse rounded-sm bg-alpha-3" />
      <div className="h-8 w-8 animate-pulse rounded-sm bg-alpha-3" />
    </div>
    <Spinner className="mx-auto" />
  </>
);

export default SubjectLoading;
