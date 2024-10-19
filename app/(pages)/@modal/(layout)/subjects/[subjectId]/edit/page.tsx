import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import getSubject from '@/_queries/get-subject';
import listTags from '@/_queries/list-tags';

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId } = await params;

  const [{ data: subject }, { data: tags }] = await Promise.all([
    getSubject(subjectId),
    listTags(),
  ]);

  if (!subject || !tags) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="Edit subject" />
      <SubjectForm subject={subject} tags={tags} />
    </Modal.Content>
  );
};

export default Page;
