import PageModalHeader from '@/_components/page-modal-header';
import TemplateForm from '@/_components/template-form';
import getEventTypeWithInputs from '@/_queries/get-event-type-with-inputs';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    eventTypeId: string;
  };
  searchParams: {
    back?: string;
  };
}

export const metadata = { title: formatTitle(['Templates', 'Create']) };

const Page = async ({
  params: { eventTypeId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();

  const [{ data: eventType }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getEventTypeWithInputs(eventTypeId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!eventType || !availableInputs || !subjects) notFound();

  return (
    <>
      <PageModalHeader back={back} title="Create template" />
      <TemplateForm
        availableInputs={availableInputs}
        back={back}
        disableCache
        isDuplicate
        subjects={subjects}
        template={{
          data: {
            content: eventType.content,
            inputIds: eventType.inputs.map((i) => i.input_id),
          },
          id: eventType.id,
          name: eventType.name!,
          public: false,
        }}
      />
    </>
  );
};

export default Page;
