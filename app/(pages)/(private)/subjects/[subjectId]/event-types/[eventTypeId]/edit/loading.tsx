import BackButton from '@/_components/back-button';
import Spinner from '@/_components/spinner';

const Loading = () => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <BackButton disabled />
      <div className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
    </div>
    <Spinner className="mx-auto" />
  </>
);

export default Loading;
