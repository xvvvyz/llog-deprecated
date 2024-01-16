import listPublicEvents from '@/_server/list-public-events';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

export const revalidate = 0;

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data } = await listPublicEvents(ctx.params.subjectId, { limit: 0 });
  return formatTabularEventsCsvResponse(data);
};
