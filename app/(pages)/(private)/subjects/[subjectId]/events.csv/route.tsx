import listEvents from '@/_server/list-events';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

export const revalidate = 0;

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (req: Request, ctx: GetContext) => {
  const { data } = await listEvents(ctx.params.subjectId);
  return formatTabularEventsCsvResponse(data);
};
