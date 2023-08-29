import listEventsFormatted from '@/_server/list-events-formatted';
import { NextResponse } from 'next/server';

export const revalidate = 60;

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const events = await listEventsFormatted(ctx.params.subjectId);
  if (!events) return new NextResponse(null, { status: 404 });
  return new NextResponse(JSON.stringify(events), { status: 200 });
};
