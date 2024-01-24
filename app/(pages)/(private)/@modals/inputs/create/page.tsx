import InputForm from '@/_components/input-form';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

export const metadata = { title: formatTitle(['Inputs', 'Create']) };

const Page = async () => {
  const { data: subjects } = await listSubjectsByTeamId();
  if (!subjects) notFound();
  const back = '/inputs';

  return (
    <PageModal back={back} temporary_forcePath={`/inputs/create`}>
      <PageModalHeader back={back} title="Create input" />
      <InputForm back={back} subjects={subjects} />
    </PageModal>
  );
};

export default Page;
