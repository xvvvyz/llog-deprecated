import listPublicEvents from '@/_server/list-public-events';
import formatTabularEventsJsonResponse from '@/_utilities/format-tabular-events-json-response';

export const revalidate = 0;

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data } = await listPublicEvents(ctx.params.subjectId);
  return formatTabularEventsJsonResponse(data);
};
