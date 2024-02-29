import InputForm from '@/_components/input-form';
import PageModalHeader from '@/_components/page-modal-header';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

export const metadata = { title: formatTitle(['Inputs', 'Create']) };

const Page = async () => {
  const { data: subjects } = await listSubjectsByTeamId();
  if (!subjects) notFound();

  return (
    <>
      <PageModalHeader title="Create input" />
      <InputForm subjects={subjects} />
    </>
  );
};

export default Page;
