import MissionForm from '@/_components/mission-form';
import PageModalHeader from '@/_components/page-modal-header';
import getMission from '@/_queries/get-mission';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

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

  if (!subject || !mission) return null;

  return (
    <>
      <PageModalHeader title={mission.name} />
      <MissionForm mission={mission} subjectId={subjectId} />
    </>
  );
};

export default Page;
