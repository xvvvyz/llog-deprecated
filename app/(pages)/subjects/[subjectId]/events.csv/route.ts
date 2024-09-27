import Number from '@/_constants/enum-number';
import listEvents from '@/_queries/list-events';
import formatTabularEventsCsvResponse from '@/_utilities/format-tabular-events-csv-response';

interface GetContext {
  params: Promise<{ subjectId: string }>;
}

export const GET = async (_: Request, { params }: GetContext) => {
  const { subjectId } = await params;

  const { data } = await listEvents(subjectId, {
    from: 0,
    to: Number.FourByteSignedIntMax - 1,
  });

  return formatTabularEventsCsvResponse(data);
};
