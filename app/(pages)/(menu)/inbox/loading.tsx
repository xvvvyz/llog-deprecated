import PageBreadcrumb from '@/_components/page-breadcrumb';
import Spinner from '@/_components/spinner';

const Loading = () => (
  <>
    <PageBreadcrumb skeleton />
    <Spinner className="mx-auto" />
  </>
);

export default Loading;
