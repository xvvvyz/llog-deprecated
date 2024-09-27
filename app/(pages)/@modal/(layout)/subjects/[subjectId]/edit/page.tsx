import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import getSubject from '@/_queries/get-subject';

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId } = await params;
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="Edit subject" />
      <SubjectForm subject={subject} />
    </Modal.Content>
  );
};

export default Page;
