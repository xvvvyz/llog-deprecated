import { BoxProps } from '(components)/box';
import Button from '(components)/button';
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
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
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
  const sessionNumber = formatSessionNumber(eventType.session);

  return (
    <Card breakpoint="sm" {...rest}>
      <div className="space-y-8">
        <div className="flex shrink-0 items-center gap-3 sm:-ml-2">
          {!isMission && mission && (
            <Button
              href={`/subjects/${subjectId}/mission/${mission.id}/session/${sessionNumber}`}
              variant="link"
            >
              <Pill
                k={CODES.mission}
                v={
                  <span className="flex gap-1">
                    {mission.name}
                    <ArrowTopRightOnSquareIcon className="w-3" />
                  </span>
                }
              />
            </Button>
          )}
          <Pill
            k={CODES[eventType.type]}
            v={mission ? formatRoutineNumber(eventType.order) : eventType.name}
          />
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
