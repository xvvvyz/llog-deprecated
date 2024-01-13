import listEvents from '@/_server/list-events';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

export const revalidate = 60;

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data } = await listEvents(ctx.params.subjectId, { limit: 0 });
  return formatTabularEventsCsvResponse(data);
};
