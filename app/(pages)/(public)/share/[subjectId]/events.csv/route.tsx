import listEvents from '@/_actions/list-events';
import Numbers from '@/_constants/enum-numbers';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

interface GetContext {
  params: {
    subjectId: string;
  };
}

export const GET = async (_: Request, ctx: GetContext) => {
  const { data } = await listEvents({
    from: 0,
    isPublic: true,
    subjectId: ctx.params.subjectId,
    to: Numbers.FourByteSignedIntMax - 1,
  });

  return formatTabularEventsCsvResponse(data);
};
