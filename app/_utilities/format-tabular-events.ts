import InputType from '@/_constants/enum-input-type';
import TimeSinceMilliseconds from '@/_constants/enum-time-since-milliseconds';
import { ListEventsData } from '@/_queries/list-events';
import forceArray from '@/_utilities/force-array';
import formatDirtyColumnHeader from '@/_utilities/format-dirty-column-header';
import formatFullName from '@/_utilities/format-full-name';
import strip from '@/_utilities/strip';

type Row = Record<string, string | string[] | number | Date>;

const formatTabularEvents = (
  events: ListEventsData,
  options?: {
    filterByInputId?: string;
    filterByInputOptions?: string[];
    flattenColumnValues?: boolean;
    includeComments?: boolean;
    includeEventsFrom?: string | null;
    includeEventsSince?: TimeSinceMilliseconds | null;
    parseTime?: boolean;
  },
) => {
  if (!events) return [];
  const table: Row[] = [];

  for (const event of events.reverse()) {
    if (
      (options?.includeEventsSince &&
        new Date(event.created_at) <
          new Date(
            new Date().getTime() - Number(options.includeEventsSince),
          )) ||
      (options?.includeEventsFrom &&
        event.type?.id !== options.includeEventsFrom &&
        event.type?.session?.protocol?.id !== options.includeEventsFrom)
    ) {
      continue;
    }

    const row: Row = {
      Id: event.id,
      'Recorded by': strip(formatFullName(event?.profile)),
      Time: options?.parseTime ? new Date(event.created_at) : event.created_at,
    };

    if (event?.type?.session) {
      row['Module name'] = strip(event.type?.name ?? '');
      row['Module number'] = (event.type.order ?? 0) + 1;
      row['Protocol name'] = strip(event.type.session.protocol?.name ?? '');
      row['Session number'] = event.type.session.order + 1;
      row['Session title'] = strip(event.type.session.title ?? '');
    } else {
      row['Event type name'] = strip(event.type?.name ?? '');
    }

    if (options?.includeComments && event.comments && event.comments.length) {
      row.Comments = event.comments.map((comment) => {
        const strippedComment = comment.content.replace(/<[^>]+>/g, ' ');

        return `${formatFullName(comment.profile)}: ${strippedComment}`
          .replace(/\s+/g, ' ')
          .replace(/ $/, '');
      });
    }

    const inputs = forceArray(event.inputs);
    const flattenColumns = new Set<string>();
    let filteredInputExists = false;

    for (const input of inputs) {
      if (
        !input.input ||
        (options?.filterByInputId &&
          input.input.id !== options.filterByInputId) ||
        (options?.filterByInputOptions?.length &&
          !options.filterByInputOptions.includes(input.option?.id ?? '') &&
          !options.filterByInputOptions.includes(String(input.value)))
      ) {
        continue;
      }

      const column = formatDirtyColumnHeader(input.input?.label);

      if (input.input.type === InputType.MultiSelect) {
        row[column] = row[column] ?? [];
        (row[column] as Array<string>).push(strip(input.option?.label));
        if (options?.flattenColumnValues) flattenColumns.add(column);
      } else if (input.input.type === InputType.Select) {
        (row[column] as string) = strip(input.option?.label);
      } else if (input.input.type === InputType.Checkbox) {
        (row[column] as string) = input.value ? 'Yes' : 'No';
      } else {
        row[column] = Number(input.value);
      }

      if (options?.filterByInputId) {
        filteredInputExists = true;
      }
    }

    if (options?.filterByInputId && !filteredInputExists) {
      continue;
    }

    if (!options?.flattenColumnValues || !flattenColumns.size) {
      table.push(row);
      continue;
    }

    for (const column of Array.from(flattenColumns.values())) {
      if (!row[column]) continue;

      for (const value of row[column] as Array<string>) {
        table.push({ Id: row.Id, Time: row.Time, [column]: value });
      }

      delete row[column];
    }

    if (!options?.filterByInputId) {
      table.push(row);
    }
  }

  return table;
};

export default formatTabularEvents;
