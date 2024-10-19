import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TeamForm from '@/_components/team-form';
import getTeam from '@/_queries/get-team';

interface PageProps {
  params: Promise<{ teamId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { teamId } = await params;
  const { data: team } = await getTeam(teamId);
  if (!team) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="Edit organization" />
      <TeamForm team={team} />
    </Modal.Content>
  );
};

export default Page;
