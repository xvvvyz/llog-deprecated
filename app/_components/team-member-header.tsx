import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import CopyJoinSubjectLinkButton from '@/_components/copy-join-subject-link-button';
import Tooltip from '@/_components/tooltip';
import listSubjectManagers from '@/_queries/list-subject-managers';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';

interface TeamMemberHeaderProps {
  subjectId: string;
  subjectShareCode: string | null;
}

const TeamMemberHeader = async ({
  subjectId,
  subjectShareCode,
}: TeamMemberHeaderProps) => {
  const { data: managers } = await listSubjectManagers(subjectId);

  return (
    <div className="mt-6">
      <div className="flex items-start justify-between gap-8 pb-1">
        <div className="flex items-start gap-6">
          {!!managers?.length && (
            <div className="flex flex-wrap gap-2">
              {managers.map(({ manager }) => (
                <Avatar
                  key={manager?.id}
                  file={manager?.image_uri}
                  id={manager?.id}
                  size="sm"
                />
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
              shareCode={subjectShareCode}
              subjectId={subjectId}
            />
          </div>
        </div>
        <Button
          href={`/subjects/${subjectId}/edit`}
          scroll={false}
          variant="link"
        >
          <PencilIcon className="w-5" />
          Edit
        </Button>
      </div>
    </div>
  );
};

export default TeamMemberHeader;
