import Number from '@/_constants/enum-number';
import listPublicEvents from '@/_queries/list-public-events';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (_: Request, ctx: GetContext) => {
  const { data } = await listPublicEvents(ctx.params.subjectId, {
    from: 0,
    to: Number.FourByteSignedIntMax - 1,
  });

  return formatTabularEventsCsvResponse(data);
};
