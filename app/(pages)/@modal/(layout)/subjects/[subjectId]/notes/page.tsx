import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubjectNotesForm from '@/_components/subject-notes-form';
import getSubjectNotes from '@/_queries/get-subject-notes';

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId } = await params;
  const { data: subjectNotes } = await getSubjectNotes(subjectId);

  return (
    <Modal.Content>
      <PageModalHeader title="Notes" />
      <SubjectNotesForm subjectId={subjectId} subjectNotes={subjectNotes} />
    </Modal.Content>
  );
};

export default Page;
