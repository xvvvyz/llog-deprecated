import InputTypes from '(utilities)/enum-input-types';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import listEvents from '(utilities)/list-events';
import { formatInTimeZone } from 'date-fns-tz';
import { JSDOM } from 'jsdom';
import { NextResponse } from 'next/server';

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data: eventsData } = await listEvents(ctx.params.subjectId);

  if (!eventsData) {
    return new NextResponse(null, { status: 404 });
  }

  const headerMap: Record<string, number> = {};

  const csvHeader = [
    'Timestamp',
    'Event',
    'Type',
    'Session',
    'Routine',
    'Author',
  ];

  const csvRows: string[][] = [];

  const searchParams = new URL(req.url).searchParams;

  const tz =
    searchParams.get('tz') ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  eventsData.forEach((eventData, i) => {
    const event = firstIfArray(eventData);
    const profile = firstIfArray(event.profile);

    csvRows[i] = [
      formatInTimeZone(
        new Date(event.created_at),
        tz,
        'yyyy-MM-dd HH:mm:ss zzz'
      ),
      event.type.name ?? event.type.session.mission.name,
      event.type.session ? 'mission' : event.type.type,
      event.type.session ? event.type.session?.order + 1 : '',
      event.type.session ? event.type.order + 1 : '',
      `${profile.first_name} ${profile.last_name}`,
    ];

    const inputs = forceArray(event.inputs).reduce(
      (
        acc: Record<string, { label: string; values: string[] }>,
        { input, option, value }
      ) => {
        if (!input) return acc;
        acc[input.id] = acc[input.id] ?? { values: [] };
        acc[input.id].label = input.label;

        if (input.type === InputTypes.Stopwatch) {
          if (option) acc[input.id].values.unshift(`${value} ${option.label}`);
          else acc[input.id].values.unshift(`Total time: ${value}`);
        } else if (value || option?.label) {
          acc[input.id].values.push(option?.label ?? value);
        }

        return acc;
      },
      {}
    );

    Object.entries(inputs).forEach(([key, value]) => {
      if (!headerMap[key]) {
        headerMap[key] = csvHeader.length;
        csvHeader.push(`"${value.label.replaceAll('"', '""')}"`);
      }

      const cell = value.values.join(' | ').replaceAll('"', '""');
      csvRows[i][headerMap[key]] = `"${cell}"`;
    });
  });

  eventsData.forEach((eventData, i) => {
    const event = firstIfArray(eventData);

    forceArray(event.comments).forEach((comment, index) => {
      const text = new JSDOM(comment.content).window.document.body.textContent;
      if (!text) return;
      const columnName = `Comment ${index + 1}`;

      if (!headerMap[columnName]) {
        headerMap[columnName] = csvHeader.length;
        csvHeader.push(columnName);
      }

      const profile = firstIfArray(comment.profile);

      const who = `${profile.first_name} ${profile.last_name}`.replaceAll(
        '""',
        '"'
      );

      csvRows[i][headerMap[columnName]] = `"${who}: ${text.replaceAll(
        '""',
        '"'
      )}"`;
    });
  });

  const header = csvHeader.join(',');
  const body = csvRows.map((row) => row.join(',')).join('\n');
  const csv = `${header}\n${body}`;

  return new NextResponse(csv, {
    headers: {
      'Content-Disposition': `attachment; filename=events.csv`,
      'Content-Type': 'text/csv',
    },
    status: 200,
  });
};
