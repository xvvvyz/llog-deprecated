import { ListEventsData } from '@/_queries/list-events';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { NextResponse } from 'next/server';

const formatTabularEventsJsonResponse = (events: ListEventsData) => {
  const json = JSON.stringify(formatTabularEvents(events));
  return new NextResponse(json, { status: 200 });
};

export default formatTabularEventsJsonResponse;
