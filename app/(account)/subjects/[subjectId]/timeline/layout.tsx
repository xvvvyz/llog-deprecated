import DownloadEventsButton from '@/(account)/subjects/[subjectId]/timeline/_components/download-events-button';
import InsightsModalButton from '@/(account)/subjects/[subjectId]/timeline/_components/insights-modal-button';
import Avatar from '@/_components/avatar';
import BackButton from '@/_components/back-button';
import DirtyHtml from '@/_components/dirty-html';
import Header from '@/_components/header';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getSubject from '@/_server/get-subject';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export const generateMetadata = async ({
  params: { subjectId },
}: LayoutProps) => {
  const { data: subject } = await getSubject(subjectId);

  return {
    title: subject?.name,
  };
};

export const revalidate = 0;

interface LayoutProps {
  eventTypes: ReactNode;
  events: ReactNode;
  missions: ReactNode;
  params: { subjectId: string };
  teamMemberHeader: ReactNode;
}

const Layout = async ({
  eventTypes,
  events,
  missions,
  params: { subjectId },
  teamMemberHeader,
}: LayoutProps) => {
  const [{ data: subject }, teamId] = await Promise.all([
    getSubject(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject) notFound();
  const isTeamMember = subject.team_id === teamId;

  return (
    <>
      <Header className="flex justify-between gap-8">
        <BackButton href="/subjects" />
        <h1 className="truncate text-2xl">{subject.name}</h1>
        <Avatar file={subject.image_uri} name={subject.name} />
      </Header>
      {isTeamMember && teamMemberHeader}
      <div className="space-y-14 px-4">
        {subject.banner && (
          <DirtyHtml className="mx-auto -mt-4 max-w-sm text-center text-fg-4">
            {subject.banner}
          </DirtyHtml>
        )}
        <div className="space-y-4">
          {missions}
          {eventTypes}
        </div>
      </div>
      <Header className="mb-0">
        <h1 className="text-2xl">Timeline</h1>
        <div className="flex gap-4">
          <DownloadEventsButton subjectId={subjectId} />
          <InsightsModalButton subjectId={subject.id} />
        </div>
      </Header>
      <div className="mt-2.5 space-y-4 px-4">{events}</div>
    </>
  );
};

export default Layout;
