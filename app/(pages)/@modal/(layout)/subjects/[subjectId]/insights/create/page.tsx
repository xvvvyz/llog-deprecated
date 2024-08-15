import InsightForm from '@/_components/insight-form';
import * as Modal from '@/_components/modal';
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
  title: formatTitle(['Subjects', 'Insights', 'New']),
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: events } = await listEvents(subjectId, {
    from: 0,
    to: Number.FourByteSignedIntMax - 1,
  });

  if (!events) return false;

  return (
    <Modal.Content className="max-w-4xl">
      <PageModalHeader title="New insight" />
      <InsightForm events={events} subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
