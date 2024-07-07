import Avatar from '@/_components/avatar';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import EventCard from '@/_components/event-card';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUser from '@/_queries/get-current-user';
import getEvent from '@/_queries/get-event';
import getPublicEvent from '@/_queries/get-public-event';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';

interface EventPageProps {
  eventId: string;
  isPublic?: boolean;
  subjectId: string;
}

const EventPage = async ({ eventId, isPublic, subjectId }: EventPageProps) => {
  const [{ data: subject }, { data: event }, user] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    isPublic ? getPublicEvent(eventId) : getEvent(eventId),
    getCurrentUser(),
  ]);

  if (!subject || !event || !event.type) return null;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <>
      <PageModalHeader
        subtitle={
          <>
            {event && (
              <div className="smallcaps flex items-center gap-2 pt-3 text-fg-4">
                {event.type.session ? 'Completed' : 'Recorded'} by
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
            {event.type.session && (
              <div className="-mr-12 flex items-baseline gap-4 pt-1.5">
                <span className="smallcaps text-fg-4">
                  Session {Number(event.type.session.order) + 1}
                </span>
                <span className="smallcaps text-fg-4">
                  Module {Number(event.type.order) + 1}
                </span>
                <Button
                  href={`/${shareOrSubjects}/${subjectId}/training-plans/${event.type.session.mission?.id}/sessions/${event.type.session.id}`}
                  scroll={false}
                  variant="link"
                >
                  View full session
                  <ArrowUpRightIcon className="w-5" />
                </Button>
              </div>
            )}
          </>
        }
        title={event.type.name ?? event.type.session?.mission?.name}
      />
      <EventCard
        event={event}
        eventType={event.type}
        isArchived={subject.archived}
        isPublic={isPublic}
        isTeamMember={!!user && subject.team_id === user.id}
        subjectId={subjectId}
        user={user}
      />
      <BackButton className="m-0 block w-full py-6 text-center" variant="link">
        Close
      </BackButton>
    </>
  );
};

export default EventPage;
