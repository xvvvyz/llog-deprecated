import { BoxProps } from '(components)/box';
import Button from '(components)/button';
import Card from '(components)/card';
import DirtyHtml from '(components)/dirty-html';
import Pill from '(components)/pill';
import CODES from '(utilities)/constant-codes';
import formatMinFractionDigits from '(utilities)/format-min-fraction-digits';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '(utilities)/get-event-type-with-inputs-and-options';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
import EventForm from './event-form';

interface EventCardProps extends BoxProps {
  event?: GetEventData | ListSessionRoutinesData['event'];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<ListSessionRoutinesData>[0];
  isMission?: boolean;
  missionId?: string;
  redirectOnSubmit?: boolean;
  subjectId: string;
}

const EventCard = ({
  event,
  eventType,
  isMission = false,
  missionId,
  redirectOnSubmit = true,
  subjectId,
  ...rest
}: EventCardProps) => {
  const routineNumber = formatMinFractionDigits({ value: eventType.order + 1 });
  const sessionNumber = (eventType.session ?? 0) + 1;

  return (
    <Card breakpoint="sm" {...rest}>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between">
          <Pill
            className="sm:-ml-2"
            k={CODES[eventType.type]}
            v={eventType.name ?? routineNumber}
          />
          {!isMission && missionId && (
            <Button
              className="underline"
              href={`/subjects/${subjectId}/mission/${missionId}/session/${sessionNumber}`}
              variant="link"
            >
              View full session
            </Button>
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
