import Empty from '@/_components/empty';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
import InformationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

interface PageProps {
  params: { subjectId: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Insights']) };
};

const Page = () => (
  <Empty className="mt-16">
    <InformationCircleIcon className="w-7" />
    Insights coming soon.
  </Empty>
);

export default Page;
