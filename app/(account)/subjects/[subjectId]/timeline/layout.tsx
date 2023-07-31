import Avatar from '@/(account)/_components/avatar';
import BackButton from '@/(account)/_components/back-button';
import DirtyHtml from '@/(account)/_components/dirty-html';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
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
  insights: ReactNode;
  missions: ReactNode;
  params: { subjectId: string };
  teamMemberHeader: ReactNode;
}

const Layout = async ({
  eventTypes,
  events,
  insights,
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
      {subject.banner && (
        <DirtyHtml className="mx-auto -mt-4 max-w-sm px-4 pb-14 text-center text-fg-4">
          {subject.banner}
        </DirtyHtml>
      )}
      <div className="space-y-16">
        <div className="space-y-4">
          {missions}
          {eventTypes}
        </div>
        {isTeamMember && insights}
      </div>
      {events}
    </>
  );
};

export default Layout;
