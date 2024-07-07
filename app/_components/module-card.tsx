import Avatar from '@/_components/avatar';
import CollapsibleSection from '@/_components/collapsible-section';
import DirtyHtml from '@/_components/dirty-html';
import { GetMissionWithSessionsData } from '@/_queries/get-mission-with-sessions';
import { GetSessionWithDetailsData } from '@/_queries/get-session-with-details';
import forceArray from '@/_utilities/force-array';
import { User } from '@supabase/supabase-js';
import EventCommentForm from './event-comment-form';
import EventComments, { EventCommentsProps } from './event-comments';
import EventForm from './event-form';

interface ModuleCardProps {
  disabled?: boolean;
  event?: NonNullable<GetSessionWithDetailsData>['modules'][0]['event'][0];
  eventType: NonNullable<GetSessionWithDetailsData>['modules'][0];
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember?: boolean;
  mission: NonNullable<GetMissionWithSessionsData>;
  subjectId: string;
  user?: User | null;
}

const ModuleCard = ({
  disabled,
  event,
  eventType,
  isArchived,
  isPublic,
  isTeamMember,
  mission,
  subjectId,
  user,
}: ModuleCardProps) => {
  const comments = forceArray(event?.comments);

  return (
    <CollapsibleSection
      className="space-y-16 py-8"
      defaultOpen={!event && !disabled}
      title={
        <div className="py-4 text-left">
          <div className="text-xl leading-none">
            Module {(eventType.order as number) + 1}
          </div>
          {event && (
            <div className="smallcaps flex items-center gap-2 pt-2 text-fg-4">
              Completed by
              <Avatar
                className="-my-[0.15rem]"
                file={event.profile?.image_uri}
                id={event.profile?.id}
                size="xs"
              />
              <span className="truncate">
                {event.profile?.first_name} {event.profile?.last_name}
              </span>
            </div>
          )}
        </div>
      }
      titleClassName="sm:pl-8 border-0 my-0 pr-6 sm:pr-10"
    >
      {eventType.content && (
        <DirtyHtml className="-my-1 px-4 sm:px-8">
          {eventType.content}
        </DirtyHtml>
      )}
      {(event || (!isPublic && !isArchived)) && (
        <EventForm
          disabled={disabled}
          event={event}
          eventType={eventType}
          isArchived={isArchived}
          isMission={!!mission}
          isPublic={isPublic}
          subjectId={subjectId}
        />
      )}
      {event && (!!comments.length || (!isPublic && !isArchived)) && (
        <div className="flex flex-col gap-8 px-4 sm:px-8">
          <EventComments
            comments={comments as EventCommentsProps['comments']}
            isArchived={isArchived}
            isPublic={isPublic}
            isTeamMember={isTeamMember}
            userId={user?.id}
          />
          {!isPublic && !isArchived && <EventCommentForm eventId={event.id} />}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default ModuleCard;
