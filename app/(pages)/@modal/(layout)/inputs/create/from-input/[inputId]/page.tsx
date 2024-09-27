import InputForm from '@/_components/input-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getInput from '@/_queries/get-input';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';

interface PageProps {
  params: Promise<{ inputId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { inputId } = await params;

  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInput(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New input" />
      <InputForm input={input} isDuplicate subjects={subjects} />
    </Modal.Content>
  );
};

export default Page;
