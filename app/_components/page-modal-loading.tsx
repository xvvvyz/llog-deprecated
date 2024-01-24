import IconButton from '@/_components/icon-button';
import PageModal from '@/_components/page-modal';
import Spinner from '@/_components/spinner';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

const PageModalLoading = () => (
  <PageModal>
    <div className="flex h-20 items-center justify-between px-4 sm:px-8">
      <div className="h-6 w-32 animate-pulse rounded-sm bg-alpha-3" />
      <IconButton
        className="relative right-1 shrink-0"
        icon={<XMarkIcon className="w-7" />}
      />
    </div>
    <div className="py-24">
      <Spinner className="mx-auto" />
    </div>
  </PageModal>
);

export default PageModalLoading;
