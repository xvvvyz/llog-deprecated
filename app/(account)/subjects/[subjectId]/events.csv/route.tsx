import InputTypes from '@/(account)/_constants/enum-input-types';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import createServerRouteClient from '@/_server/create-server-route-client';
import { formatInTimeZone } from 'date-fns-tz';
import { JSDOM } from 'jsdom';
import { NextResponse } from 'next/server';

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data: eventsData } = await createServerRouteClient()
    .from('events')
    .select(
      `
      comments(
        content,
        profile:profiles(first_name, last_name)
      ),
      created_at,
      inputs:event_inputs(
        input:inputs(id, label, type),
        option:input_options(id, label),
        value
      ),
      profile:profiles(first_name, last_name),
      type:event_types(
        session:sessions(
          mission:missions(name),
          order
        ),
        name,
        order
      )`
    )
    .eq('subject_id', ctx.params.subjectId)
    .order('created_at', { ascending: false })
    .order('created_at', { foreignTable: 'comments' })
    .order('order', { foreignTable: 'inputs' });

  if (!eventsData) return new NextResponse(null, { status: 404 });

  const headerMap: Record<string, number> = {};
  const csvHeader = ['Timestamp', 'Event', 'Type', 'Session', 'Part', 'Author'];
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
      event.type.session ? 'mission' : 'event',
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
