import InsightForm from '@/_components/insight-form';
import PageModalHeader from '@/_components/page-modal-header';
import Number from '@/_constants/enum-number';
import listEvents from '@/_queries/list-events';
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
  const { data: events } = await listEvents(subjectId, {
    from: 0,
    to: Number.FourByteSignedIntMax - 1,
  });

  if (!events) return false;

  return (
    <>
      <PageModalHeader title="Create insight" />
      <InsightForm events={events} subjectId={subjectId} />
    </>
  );
};

export default Page;
