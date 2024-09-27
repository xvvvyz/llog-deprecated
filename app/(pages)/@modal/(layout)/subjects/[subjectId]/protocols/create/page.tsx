import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import ProtocolForm from '@/_components/protocol-form';
import ProtocolUseTemplateDrawer from '@/_components/protocol-use-template-drawer';
import TemplateType from '@/_constants/enum-template-type';
import getSubject from '@/_queries/get-subject';
import listTemplatesBySubjectIdAndType from '@/_queries/list-templates-by-subject-id-and-type';

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId } = await params;

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
          <ProtocolUseTemplateDrawer
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
