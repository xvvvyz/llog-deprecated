import { BoxProps } from '(components)/box';
import Card from '(components)/card';
import DirtyHtml from '(components)/dirty-html';
import Pill from '(components)/pill';
import CODES from '(utilities)/constant-codes';
import formatRoutineNumber from '(utilities)/format-routine-number';
import formatSessionNumber from '(utilities)/format-session-number';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '(utilities)/get-event-type-with-inputs-and-options';
import { GetMissionData } from '(utilities)/get-mission';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
import EventCardMenu from './event-card-menu';
import EventForm from './event-form';

interface EventCardProps extends BoxProps {
  event?: GetEventData | ListSessionRoutinesData['event'];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<ListSessionRoutinesData>[0];
  isMission?: boolean;
  mission?: GetMissionData | GetEventData['type']['mission'];
  redirectOnSubmit?: boolean;
  subjectId: string;
}

const EventCard = ({
  event,
  eventType,
  isMission = false,
  mission,
  redirectOnSubmit = true,
  subjectId,
  ...rest
}: EventCardProps) => {
  const commonPill = [
    CODES[eventType.type],
    mission ? formatRoutineNumber(eventType.order) : eventType.name,
  ];

  return (
    <Card breakpoint="sm" {...rest}>
      <div className="space-y-8">
        <div className="flex h-4 shrink-0 items-center justify-between gap-3">
          <Pill
            className="text-fg-2"
            values={
              !isMission && mission
                ? [CODES.mission, mission.name, ...commonPill]
                : commonPill
            }
          />
          {!isMission && mission && (
            <EventCardMenu
              missionId={mission.id}
              sessionNumber={formatSessionNumber(eventType.session)}
              subjectId={subjectId}
            />
          )}
        </div>
        {eventType.content && (
          <DirtyHtml as="article">{eventType.content}</DirtyHtml>
        )}
        <EventForm
          event={event}
          eventType={eventType}
          isMission={isMission}
          redirectOnSubmit={redirectOnSubmit}
          subjectId={subjectId}
        />
      </div>
    </Card>
  );
};

export default EventCard;
