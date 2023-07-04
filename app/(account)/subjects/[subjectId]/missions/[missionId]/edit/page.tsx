import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getMission from '@/(account)/_server/get-mission';
import getSubject from '@/(account)/_server/get-subject';
import formatTitle from '@/(account)/_utilities/format-title';
import MissionForm from '@/(account)/subjects/[subjectId]/missions/_components/mission-form';
import { notFound } from 'next/navigation';

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

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

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
