import Avatar from '@/(account)/_components/avatar';
import getSubject from '@/(account)/_server/get-subject';
import listSubjectManagers from '@/(account)/_server/list-subject-managers';
import forceArray from '@/(account)/_utilities/force-array';
import CopyJoinSubjectLinkButton from '@/(account)/subjects/[subjectId]/timeline/@teamMemberHeader/_components/copy-join-subject-link-button';
import Button from '@/_components/button';
import { PencilIcon } from '@heroicons/react/24/outline';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: managers }] = await Promise.all([
    getSubject(subjectId),
    listSubjectManagers(subjectId),
  ]);

  if (!subject || !managers) return null;

  return (
    <div className="-mt-10 mb-16 px-4">
      <div className="flex items-start justify-between gap-6 border-t border-alpha-1 pb-1 pt-6">
        <div className="flex items-start gap-6">
          {!!managers?.length && (
            <div className="flex flex-wrap gap-2">
              {forceArray(managers).map(({ manager }) => (
                <Avatar key={manager.id} name={manager.first_name} size="sm" />
              ))}
            </div>
          )}
          <CopyJoinSubjectLinkButton
            shareCode={subject.share_code}
            subjectId={subjectId}
          />
        </div>
        <Button
          href={`/subjects/${subjectId}/edit?back=/subjects/${subjectId}/timeline`}
          variant="link"
        >
          <PencilIcon className="w-5" />
          Edit
        </Button>
      </div>
    </div>
  );
};

export default Page;
