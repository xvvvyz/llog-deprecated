import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import ProtocolForm from '@/_components/protocol-form';
import getProtocol from '@/_queries/get-protocol';
import getSubject from '@/_queries/get-subject';

interface PageProps {
  params: Promise<{ subjectId: string; protocolId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId, protocolId } = await params;

  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getProtocol(protocolId),
  ]);

  if (!subject || !mission) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="Edit protocol name" />
      <ProtocolForm protocol={mission} subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
