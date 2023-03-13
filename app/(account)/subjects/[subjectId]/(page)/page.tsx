import Avatar from '(components)/avatar';
import BackButton from '(components)/back-button';
import Header from '(components)/header';
import IconButton from '(components)/icon-button';
import LinkList from '(components)/link-list';
import PollingRefresh from '(components)/polling-refresh';
import EventTypesEnum from '(utilities)/enum-event-types';
import getCurrentTeamId from '(utilities)/get-current-team-id';
import getSubject from '(utilities)/get-subject';
import { PencilIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EventTypes from './(components)/event-types';
import Missions from './(components)/missions';
import Timeline from './(components)/timeline';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
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
      <LinkList>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <Missions isTeamMember={isTeamMember} subjectId={subjectId} />
        </Suspense>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <EventTypes
            isTeamMember={isTeamMember}
            subjectId={subjectId}
            type={EventTypesEnum.Routine}
          />
        </Suspense>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <EventTypes
            isTeamMember={isTeamMember}
            subjectId={subjectId}
            type={EventTypesEnum.Observation}
          />
        </Suspense>
      </LinkList>
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <Timeline subjectId={subjectId} />
      </Suspense>
    </>
  );
};

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return;
  return { title: subject.name };
};

export const revalidate = 0;
export default Page;
