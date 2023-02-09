import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Card from '(components)/card';
import Header from '(components)/header';
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
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithRoutines(missionId),
    listInputs(),
    listRoutineTemplatesWithData(),
  ]);

  if (!subject || !mission) return notFound();
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
      <main>
        <Card breakpoint="sm">
          <MissionForm
            availableInputs={availableInputs}
            availableTemplates={availableTemplates}
            mission={mission}
            subjectId={subjectId}
          />
        </Card>
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
