import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import ProtocolForm from '@/_components/protocol-form';
import ProtocolUseTemplateModal from '@/_components/protocol-use-template-modal';
import TemplateType from '@/_constants/enum-template-type';
import getSubject from '@/_queries/get-subject';
import listTemplatesBySubjectIdAndType from '@/_queries/list-templates-by-subject-id-and-type';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: availableProtocolTemplates }, { data: subject }] =
    await Promise.all([
      listTemplatesBySubjectIdAndType({
        subjectId,
        type: TemplateType.Protocol,
      }),
      getSubject(subjectId),
    ]);

  if (!availableProtocolTemplates || !subject) return null;

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          <ProtocolUseTemplateModal
            availableProtocolTemplates={availableProtocolTemplates}
            subjectId={subjectId}
          />
        }
        title="New protocol"
      />
      <ProtocolForm subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
