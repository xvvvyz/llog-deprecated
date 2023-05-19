import getMission from '(utilities)/get-mission';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import SessionNav from '../../../../../../(components)/session-nav';
import SessionModal from './(components)/session-modal';

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
    <SessionModal
      nav={
        <SessionNav
          mission={mission}
          sessionId={sessionId}
          subjectId={subjectId}
        />
      }
      title={mission.name}
    >
      <div className="flex flex-col gap-4">{children}</div>
    </SessionModal>
  );
};

export const revalidate = 0;
export default Layout;
