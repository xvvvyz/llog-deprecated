import CopyJoinSubjectLinkButton from '@/(account)/subjects/[subjectId]/timeline/@teamMemberHeader/_components/copy-join-subject-link-button';
import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Tooltip from '@/_components/tooltip';
import getSubject from '@/_server/get-subject';
import listSubjectManagers from '@/_server/list-subject-managers';
import forceArray from '@/_utilities/force-array';
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
      <div className="flex items-start justify-between gap-8 pb-1">
        <div className="flex items-start gap-6">
          {!!managers?.length && (
            <div className="flex flex-wrap gap-2">
              {forceArray(managers).map(({ manager }) => (
                <Avatar key={manager.id} name={manager.first_name} size="sm" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            {!managers?.length && (
              <Tooltip
                id="clients-tip"
                placement="left"
                tip={
                  <>
                    Clients can complete missions, record events and
                    add&nbsp;comments.
                  </>
                }
              />
            )}
            <CopyJoinSubjectLinkButton
              shareCode={subject.share_code}
              subjectId={subjectId}
            />
          </div>
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
