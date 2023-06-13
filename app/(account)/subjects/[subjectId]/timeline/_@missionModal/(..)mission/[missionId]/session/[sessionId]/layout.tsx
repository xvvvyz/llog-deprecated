import getMission from '@/(account)/_server/get-mission';
import getSubject from '@/(account)/_server/get-subject';
import SessionNav from '@/(account)/subjects/[subjectId]/_components/session-nav';
import SessionModal from '@/(account)/subjects/[subjectId]/timeline/_@missionModal/(..)mission/[missionId]/session/[sessionId]/_components/session-modal';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

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
      subjectId={subjectId}
      title={mission.name}
    >
      <div className="flex flex-col gap-4">{children}</div>
    </SessionModal>
  );
};

export default Layout;
