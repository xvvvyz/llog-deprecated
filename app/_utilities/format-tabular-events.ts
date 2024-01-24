import { ListEventsData } from '@/_queries/list-events';
import forceArray from '@/_utilities/force-array';

const strip = (str?: string) => (str ? str.replace(/['"\[\]]/g, '') : '');
type Row = Record<string, string | string[] | number>;

const formatTabularEvents = (events: ListEventsData) => {
  if (!events) return [];
  const table: Row[] = [];

  events.reverse().forEach((event) => {
    const row: Row = {
      Name: strip(event.type?.name ?? event.type?.session?.mission?.name),
      'Recorded by': strip(
        `${event.profile?.first_name} ${event.profile?.last_name}`,
      ),
      Time: event.created_at,
    };

    if (event?.type?.session) {
      row['Module number'] = (event.type.order ?? 0) + 1;
      row['Session number'] = event.type.session.order + 1;
    }

    if (event.comments && event.comments.length) {
      row.Comments = event.comments.map((comment) => {
        const strippedComment = comment.content.replace(/<[^>]+>/g, ' ');

        return `${comment.profile?.first_name} ${comment.profile?.last_name}: ${strippedComment}`
          .replace(/\s+/g, ' ')
          .replace(/ $/, '');
      });
    }

    forceArray(event.inputs).forEach((input) => {
      if (!input.input) return;
      const strippedLabel = strip(input.input?.label);

      if (input.input.type === 'multi_select') {
        row[strippedLabel] = row[strippedLabel] ?? [];
        (row[strippedLabel] as string[]).push(input.option?.label as string);
      } else {
        row[strippedLabel] = (input.value ?? input.option?.label) as string;
      }
    });

    table.push(row);
  });

  return table;
};

export default formatTabularEvents;
