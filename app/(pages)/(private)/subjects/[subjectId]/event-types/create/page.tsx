import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import EventTypeForm from '@/_components/event-type-form';
import getSubject from '@/_server/get-subject';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/_utilities/format-title';

import listTemplatesWithData, {
  ListTemplatesWithDataData,
} from '@/_server/list-templates-with-data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Create event type']) };
};

export const revalidate = 0;

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: availableInputs },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    listInputs(),
    listTemplatesWithData(),
  ]);

  if (!subject) notFound();

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href={`/subjects/${subjectId}`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}`],
            ['Create event type'],
          ]}
        />
      </div>
      <EventTypeForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId,
        )}
        availableTemplates={availableTemplates as ListTemplatesWithDataData}
        subjectId={subjectId}
      />
    </>
  );
};

export default Page;
