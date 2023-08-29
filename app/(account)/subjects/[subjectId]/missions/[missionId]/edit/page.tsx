import MissionForm from '@/(account)/subjects/[subjectId]/missions/_components/mission-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import getMission from '@/_server/get-mission';
import getSubject from '@/_server/get-subject';
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

  return {
    title: formatTitle([subject?.name, mission?.name, 'Edit']),
  };
};

export const revalidate = 0;

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission) notFound();

  return (
    <>
      <Header>
        <BackButton
          href={`/subjects/${subjectId}/missions/${missionId}/sessions`}
        />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [
              mission.name,
              `/subjects/${subjectId}/missions/${missionId}/sessions`,
            ],
            ['Edit'],
          ]}
        />
      </Header>
      <MissionForm mission={mission} subjectId={subjectId} />
    </>
  );
};

export default Page;
