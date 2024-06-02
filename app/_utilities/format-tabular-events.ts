import InputTypes from '@/_constants/enum-input-types';
import { ListEventsData } from '@/_queries/list-events';
import forceArray from '@/_utilities/force-array';
import formatDirtyColumnHeader from '@/_utilities/format-dirty-column-header';
import formatFullName from '@/_utilities/format-full-name';
import strip from '@/_utilities/strip';

type Row = Record<string, string | string[] | number>;

const formatTabularEvents = (events: ListEventsData) => {
  if (!events) return [];
  const table: Row[] = [];

  events.reverse().forEach((event) => {
    const row: Row = {
      Id: event.id,
      Name: strip(event.type?.name ?? event.type?.session?.mission?.name),
      'Recorded by': strip(formatFullName(event?.profile)),
      Time: event.created_at,
    };

    if (event?.type?.session) {
      row['Module number'] = (event.type.order ?? 0) + 1;
      row['Session number'] = event.type.session.order + 1;
    }

    if (event.comments && event.comments.length) {
      row.Comments = event.comments.map((comment) => {
        const strippedComment = comment.content.replace(/<[^>]+>/g, ' ');

        return `${formatFullName(comment.profile)}: ${strippedComment}`
          .replace(/\s+/g, ' ')
          .replace(/ $/, '');
      });
    }

    forceArray(event.inputs).forEach((input) => {
      if (!input.input) return;
      const column = formatDirtyColumnHeader(input.input?.label);

      if (input.input.type === InputTypes.MultiSelect) {
        row[column] = row[column] ?? [];
        (row[column] as string[]).push(strip(input.option?.label));
      } else if (input.input.type === InputTypes.Select) {
        (row[column] as string) = strip(input.option?.label);
      } else {
        row[column] = Number(input.value);
      }
    });

    table.push(row);
  });

  return table;
};

export default formatTabularEvents;
