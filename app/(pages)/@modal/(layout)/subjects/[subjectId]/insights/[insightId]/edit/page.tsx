import InsightForm from '@/_components/insight-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import Number from '@/_constants/enum-number';
import getInsight from '@/_queries/get-insight';
import listEvents from '@/_queries/list-events';

interface PageProps {
  params: {
    insightId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { insightId, subjectId } }: PageProps) => {
  const [{ data: events }, { data: insight }] = await Promise.all([
    listEvents(subjectId, { from: 0, to: Number.FourByteSignedIntMax - 1 }),
    getInsight(insightId),
  ]);

  if (!events || !insight) return null;

  return (
    <Modal.Content className="max-w-3xl">
      <PageModalHeader title="Edit insight" />
      <InsightForm events={events} insight={insight} subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
