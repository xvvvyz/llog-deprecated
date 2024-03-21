import Button from '@/_components/button';
import Empty from '@/_components/empty';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
import InformationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

interface PageProps {
  params: { subjectId: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Insights']) };
};

const Page = ({ params: { subjectId } }: PageProps) => {
  return (
    <div className="mt-16 space-y-4">
      <Button
        className="w-full"
        colorScheme="transparent"
        href={`/subjects/${subjectId}/insights/create`}
        scroll={false}
      >
        <PlusIcon className="w-5" />
        Create insight
      </Button>
      <Empty>
        <InformationCircleIcon className="w-7" />
        No insights
      </Empty>
    </div>
  );
};

export default Page;
