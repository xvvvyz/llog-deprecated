import Avatar from '(components)/avatar';
import BackButton from '(components)/back-button';
import Header from '(components)/header';
import IconButton from '(components)/icon-button';
import LinkList from '(components)/link-list';
import PollingRefresh from '(components)/polling-refresh';
import createServerSupabaseClient from '(utilities)/create-server-supabase-client';
import EventTypesEnum from '(utilities)/enum-event-types';
import getCurrentTeamId from '(utilities)/get-current-team-id';
import getSubject from '(utilities)/get-subject';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import EventTypes from './(components)/event-types';
import Missions from './(components)/missions';
import Timeline from './(components)/timeline';

interface PageProps {
  params: {
    subjectId: string;
  };
  searchParams?: {
    share?: string;
  };
}

const Page = async ({ params: { subjectId }, searchParams }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);

  if (!subject) {
    if (!searchParams?.share) notFound();

    await createServerSupabaseClient().rpc('join_subject_as_manager', {
      share_code: searchParams.share,
    });

    // todo: when redirecting to the subject page works, do it
    redirect('/subjects');
  }

  const currentTeamId = await getCurrentTeamId();
  const isTeamMember = subject.team_id === currentTeamId;

  return (
    <>
      <PollingRefresh />
      <Header className="flex justify-between">
        <BackButton href="/subjects" />
        {!isTeamMember && <h1 className="truncate text-2xl">{subject.name}</h1>}
        <div className="flex items-center justify-center gap-4">
          <Avatar file={subject.image_uri} name={subject.name} />
          {isTeamMember && <h1 className="truncate">{subject.name}</h1>}
        </div>
        {isTeamMember && (
          <IconButton
            href={`/subjects/${subject.id}/settings`}
            icon={<Cog6ToothIcon className="relative -right-[0.18em] w-7" />}
            label="Edit"
          />
        )}
      </Header>
      <LinkList>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <Missions subjectId={subjectId} />
        </Suspense>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <EventTypes subjectId={subjectId} type={EventTypesEnum.Routine} />
        </Suspense>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <EventTypes subjectId={subjectId} type={EventTypesEnum.Observation} />
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

export default Page;
