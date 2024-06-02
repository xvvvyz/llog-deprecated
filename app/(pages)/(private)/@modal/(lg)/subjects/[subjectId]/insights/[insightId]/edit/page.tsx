import InsightForm from '@/_components/insight-form';
import PageModalHeader from '@/_components/page-modal-header';
import Numbers from '@/_constants/enum-numbers';
import getInsight from '@/_queries/get-insight';
import listEvents from '@/_queries/list-events';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    insightId: string;
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Insights', 'Edit']),
};

const Page = async ({ params: { insightId, subjectId } }: PageProps) => {
  const [{ data: events }, { data: availableInputs }, { data: insight }] =
    await Promise.all([
      listEvents(subjectId, { from: 0, to: Numbers.FourByteSignedIntMax - 1 }),
      listInputsBySubjectId(subjectId),
      getInsight(insightId),
    ]);

  if (!availableInputs || !insight) return null;

  return (
    <>
      <PageModalHeader title="Create insight" />
      <InsightForm
        availableInputs={availableInputs}
        events={formatTabularEvents(events)}
        insight={insight}
        subjectId={subjectId}
      />
    </>
  );
};

export default Page;
