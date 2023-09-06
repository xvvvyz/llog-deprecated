import listEventsFormattedWithComments from '@/_server/list-events-formatted-with-comments';
import { json2csv } from 'json-2-csv';
import { NextResponse } from 'next/server';

export const revalidate = 60;

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const events = await listEventsFormattedWithComments(ctx.params.subjectId);
  if (!events.length) return new NextResponse(null, { status: 404 });
  const csv = await json2csv(events, { emptyFieldValue: '', sortHeader: true });

  const headers = {
    'Content-Disposition': 'attachment; filename=events.csv',
    'Content-Type': 'text/csv',
  };

  return new NextResponse(csv, { headers, status: 200 });
};
