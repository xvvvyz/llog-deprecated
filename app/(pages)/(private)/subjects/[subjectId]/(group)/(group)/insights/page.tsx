import Button from '@/_components/button';
import Empty from '@/_components/empty';
import getCurrentUser from '@/_queries/get-current-user';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
import InformationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

interface PageProps {
  params: { subjectId: string };
}

export const metadata = { title: formatTitle(['Subjects', 'Insights']) };

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, user] = await Promise.all([
    getSubject(subjectId),
    getCurrentUser(),
  ]);

  const isTeamMember = subject?.team_id === user?.id;

  return (
    <div className="mt-16 space-y-4">
      {isTeamMember && (
        <Button
          className="w-full"
          colorScheme="transparent"
          href={`/subjects/${subjectId}/insights/create`}
          scroll={false}
        >
          <PlusIcon className="w-5" />
          Create insight
        </Button>
      )}
      <Empty>
        <InformationCircleIcon className="w-7" />
        No insights
      </Empty>
    </div>
  );
};

export default Page;
