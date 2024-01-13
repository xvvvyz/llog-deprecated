import { ListEventsData } from '@/_server/list-events';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { NextResponse } from 'next/server';

const formatTabularEventsJsonResponse = (events: ListEventsData) => {
  if (!events?.length) return new NextResponse(null, { status: 404 });
  const json = JSON.stringify(formatTabularEvents(events));
  return new NextResponse(json, { status: 200 });
};

export default formatTabularEventsJsonResponse;
