import InsightForm from '@/_components/insight-form';
import PageModalHeader from '@/_components/page-modal-header';
import Number from '@/_constants/enum-number';
import listEvents from '@/_queries/list-events';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Insights', 'Create']),
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: events }, { data: availableInputs }] = await Promise.all([
    listEvents(subjectId, { from: 0, to: Number.FourByteSignedIntMax - 1 }),
    listInputsBySubjectId(subjectId),
  ]);

  if (!availableInputs) return null;

  return (
    <>
      <PageModalHeader title="Create insight" />
      <InsightForm
        availableInputs={availableInputs}
        events={formatTabularEvents(events)}
        subjectId={subjectId}
      />
    </>
  );
};

export default Page;
