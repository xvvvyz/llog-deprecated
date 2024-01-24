import MissionForm from '@/_components/mission-form';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getMission from '@/_queries/get-mission';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  return { title: formatTitle([subject?.name, mission?.name, 'Edit']) };
};

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission) notFound();
  const back = `/subjects/${subjectId}`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/subjects/${subjectId}/training-plans/${missionId}/edit`}
    >
      <PageModalHeader back={back} title={mission.name} />
      <MissionForm mission={mission} subjectId={subjectId} />
    </PageModal>
  );
};

export default Page;
