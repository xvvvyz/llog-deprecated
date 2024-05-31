import InsightForm from '@/_components/insight-form';
import PageModalHeader from '@/_components/page-modal-header';
import Numbers from '@/_constants/enum-numbers';
import listEvents from '@/_queries/list-events';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectEventTypes from '@/_queries/list-subject-event-types';
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
  const [{ data: events }, { data: availableInputs }, { data: eventTypes }] =
    await Promise.all([
      listEvents(subjectId, {
        from: 0,
        to: Numbers.FourByteSignedIntMax - 1,
      }),
      listInputsBySubjectId(subjectId),
      listSubjectEventTypes(subjectId),
    ]);

  if (!availableInputs || !eventTypes) {
    return null;
  }

  return (
    <>
      <PageModalHeader title="Create insight" />
      <InsightForm
        availableInputs={availableInputs}
        eventTypes={eventTypes}
        events={formatTabularEvents(events)}
        subjectId={subjectId}
      />
    </>
  );
};

export default Page;
