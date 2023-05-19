import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import getMission from '(utilities)/get-mission';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import SessionNav from '../../../../(components)/session-nav';

interface LayoutProps {
  children: ReactNode;
  params: {
    missionId: string;
    sessionId: string;
    subjectId: string;
  };
}

const Layout = async ({
  children,
  params: { missionId, sessionId, subjectId },
}: LayoutProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [mission.name],
          ]}
        />
      </Header>
      <SessionNav
        className="px-4"
        mission={mission}
        sessionId={sessionId}
        subjectId={subjectId}
      />
      <div className="mt-8 flex flex-col gap-4">{children}</div>
    </>
  );
};

export default Layout;
