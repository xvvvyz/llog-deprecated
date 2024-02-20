import PageModalHeader from '@/_components/page-modal-header';
import TemplateForm from '@/_components/template-form';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: {
    back?: string;
  };
}

export const metadata = { title: formatTitle(['Templates', 'Create']) };

const Page = async ({ searchParams: { back } }: PageProps) => {
  if (!back) notFound();

  const [{ data: availableInputs }, { data: subjects }] = await Promise.all([
    listInputs(),
    listSubjectsByTeamId(),
  ]);

  if (!availableInputs || !subjects) notFound();

  return (
    <>
      <PageModalHeader title="Create template" />
      <TemplateForm availableInputs={availableInputs} subjects={subjects} />
    </>
  );
};

export default Page;
