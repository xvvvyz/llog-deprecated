import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getSubject from '@/(account)/_server/get-subject';
import getTemplate from '@/(account)/_server/get-template';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/(account)/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/(account)/_utilities/format-title';
import EventTypeForm from '@/(account)/subjects/[subjectId]/settings/event-type/_components/event-type-form';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
    templateId: string;
  };
}

const Page = async ({ params: { subjectId, templateId } }: PageProps) => {
  const [{ data: subject }, { data: availableInputs }, { data: template }] =
    await Promise.all([
      getSubject(subjectId),
      listInputs(),
      getTemplate(templateId),
    ]);

  if (!subject) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Settings', `/subjects/${subjectId}/settings`],
            ['Create event type'],
          ]}
        />
      </Header>
      <EventTypeForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        subjectId={subjectId}
        template={template}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return;

  return {
    title: formatTitle([subject.name, 'Settings', 'Create event type']),
  };
};

export default Page;
