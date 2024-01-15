import { ListEventsData } from '@/_server/list-events';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import { json2csv } from 'json-2-csv';
import { NextResponse } from 'next/server';

const formatTabularEventsCsvResponse = (events: ListEventsData) => {
  const csv = json2csv(formatTabularEvents(events), {
    emptyFieldValue: '',
    sortHeader: true,
  });

  const headers = {
    'Content-Disposition': 'attachment; filename=events.csv',
    'Content-Type': 'text/csv',
  };

  return new NextResponse(csv, { headers, status: 200 });
};

export default formatTabularEventsCsvResponse;
