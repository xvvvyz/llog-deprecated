import Avatar from '@/_components/avatar';
import BackButton from '@/_components/back-button';
import Header from '@/_components/header';
import IconButton from '@/_components/icon-button';
import PollingRefresh from '@/_components/polling-refresh';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getSubject from '@/_server/get-subject';
import { PencilIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutProps {
  // eventModal: ReactNode;
  eventTypes: ReactNode;
  events: ReactNode;
  // missionModal: ReactNode;
  missions: ReactNode;
  params: { subjectId: string };
}

const Layout = async ({
  // eventModal,
  eventTypes,
  events,
  // missionModal,
  missions,
  params: { subjectId },
}: LayoutProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) notFound();
  const currentTeamId = await getCurrentTeamId();
  const isTeamMember = subject.team_id === currentTeamId;

  return (
    <>
      <PollingRefresh />
      <Header className="flex justify-between gap-8">
        <BackButton href="/subjects" />
        {isTeamMember ? (
          <>
            <div className="flex items-center justify-center gap-4 overflow-hidden">
              <Avatar file={subject.image_uri} name={subject.name} />
              <h1 className="truncate">{subject.name}</h1>
            </div>
            <IconButton
              href={`/subjects/${subject.id}/settings`}
              icon={
                <PencilIcon className="relative -right-[0.15em] w-7 p-0.5" />
              }
              label="Edit"
            />
          </>
        ) : (
          <>
            <h1 className="truncate text-2xl">{subject.name}</h1>
            <Avatar file={subject.image_uri} name={subject.name} />
          </>
        )}
      </Header>
      <div className="space-y-4">
        {missions}
        {eventTypes}
      </div>
      {events}
      {/*{eventModal}*/}
      {/*{missionModal}*/}
    </>
  );
};

export const generateMetadata = async ({
  params: { subjectId },
}: LayoutProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return;
  return { title: subject.name };
};

export const revalidate = 0;
export default Layout;
