import Number from '@/_constants/enum-number';
import listEvents from '@/_queries/list-events';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (_: Request, ctx: GetContext) => {
  const { data } = await listEvents(ctx.params.subjectId, {
    from: 0,
    to: Number.FourByteSignedIntMax - 1,
  });

  return formatTabularEventsCsvResponse(data);
};
