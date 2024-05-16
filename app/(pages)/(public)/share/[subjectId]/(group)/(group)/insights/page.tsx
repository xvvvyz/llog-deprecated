import Empty from '@/_components/empty';
import formatTitle from '@/_utilities/format-title';
import InformationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

export const metadata = { title: formatTitle(['Subjects', 'Insights']) };

const Page = () => (
  <Empty className="mt-16">
    <InformationCircleIcon className="w-7" />
    Insights coming soon.
  </Empty>
);

export default Page;
