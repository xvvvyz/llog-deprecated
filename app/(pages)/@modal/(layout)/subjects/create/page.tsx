import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import listTags from '@/_queries/list-tags';

const Page = async () => {
  const { data: tags } = await listTags();
  if (!tags) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New subject" />
      <SubjectForm tags={tags} />
    </Modal.Content>
  );
};

export default Page;
