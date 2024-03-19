import Numbers from '@/_constants/enum-numbers';
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
    to: Numbers.FourByteSignedIntMax - 1,
  });

  return formatTabularEventsCsvResponse(data);
};
