import { ListEventsData } from '@/_queries/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import formatDate from '@/_utilities/format-date';

const formatTimelineEvents = (events: NonNullable<ListEventsData>) =>
  Object.values(
    events.reduce(
      (acc, event) => {
        const date = formatDate(event.created_at);
        acc[date] = acc[date] ?? new Map();
        const type = firstIfArray(event.type);
        const key = type?.session?.id ?? event.id;
        const keyEvents = acc[date].get(key) ?? [];

        const eventIndex = keyEvents.findIndex(
          (e) => (firstIfArray(e.type)?.order ?? 0) > (type?.order ?? 0),
        );

        keyEvents.splice(
          eventIndex === -1 ? keyEvents.length : eventIndex,
          0,
          event,
        );

        acc[date].set(key, keyEvents);
        return acc;
      },
      {} as Record<string, Map<string, ListEventsData>>,
    ),
  );

export default formatTimelineEvents;
