import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import IconButton from '(components)/icon-button';
import forceArray from '(utilities)/force-array';
import formatTitle from '(utilities)/format-title';
import getMission from '(utilities)/get-mission';
import getSubject from '(utilities)/get-subject';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
  const sessions = forceArray(mission.sessions);
  const sessionIndex = sessions.findIndex(({ id }) => id === sessionId);
  if (sessionIndex === -1) notFound();
  const previousSessionId = sessions[sessionIndex - 1]?.id;
  const nextSessionId = sessions[sessionIndex + 1]?.id;
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], [mission.name]]} />
      </Header>
      <nav className="mb-16 flex w-full items-center justify-between sm:mb-8">
        <IconButton
          disabled={!sessionIndex}
          href={`/subjects/${subjectId}/mission/${missionId}/session/${previousSessionId}`}
          icon={<ChevronLeftIcon className="relative -left-2 w-7" />}
          label="Previous session"
        />
        <span className="text-fg-3">
          Session {sessionIndex + 1} of {sessions.length}
        </span>
        <IconButton
          disabled={sessionIndex === sessions.length - 1}
          href={`/subjects/${subjectId}/mission/${missionId}/session/${nextSessionId}`}
          icon={<ChevronRightIcon className="relative -right-2 w-7" />}
          label="Next session"
        />
      </nav>
      {children}
    </>
  );
};

export const generateMetadata = async ({
  params: { missionId, sessionId, subjectId },
}: LayoutProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission || !sessionId) return;
  const sessions = forceArray(mission.sessions);
  const sessionIndex = sessions.findIndex(({ id }) => id === sessionId);
  if (sessionIndex === -1) return null;

  return {
    title: formatTitle([subject.name, mission.name, String(sessionIndex + 1)]),
  };
};

export default Layout;
