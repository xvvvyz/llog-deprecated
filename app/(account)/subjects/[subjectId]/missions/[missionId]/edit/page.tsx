import MissionForm from '@/(account)/subjects/[subjectId]/missions/_components/mission-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import getMission from '@/_server/get-mission';
import getSubject from '@/_server/get-subject';
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

  if (!subject || !mission) return null;

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton
          href={`/subjects/${subjectId}/missions/${missionId}/sessions`}
        />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}`],
            [
              mission.name,
              `/subjects/${subjectId}/missions/${missionId}/sessions`,
            ],
            ['Edit'],
          ]}
        />
      </div>
      <MissionForm mission={mission} subjectId={subjectId} />
    </>
  );
};

export default Page;
