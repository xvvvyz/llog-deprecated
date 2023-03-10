import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getCurrentUser from '(utilities)/get-current-user';
import getMissionWithRoutines from '(utilities)/get-mission-with-routines';
import getSubject from '(utilities)/get-subject';
import listInputs from '(utilities)/list-inputs';
import listRoutineTemplatesWithData from '(utilities)/list-routine-templates-with-data';
import { notFound } from 'next/navigation';
import MissionForm from '../../(components)/mission-form';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: availableInputs },
    { data: availableTemplates },
    user,
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithRoutines(missionId),
    listInputs(),
    listRoutineTemplatesWithData(),
    getCurrentUser(),
  ]);

  if (!subject || !mission || !user) notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={`${subjectHref}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Settings', `${subjectHref}/settings`],
            [mission.name],
          ]}
        />
      </Header>
      <MissionForm
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        mission={mission}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithRoutines(missionId),
  ]);

  if (!subject || !mission) return;
  return { title: formatTitle([subject.name, 'Settings', mission.name]) };
};

export default Page;
