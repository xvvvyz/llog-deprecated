import Avatar from '(components)/avatar';
import BackButton from '(components)/back-button';
import Header from '(components)/header';
import IconButton from '(components)/icon-button';
import { LinkList } from '(components)/link-list';
import EventTypesEnum from '(utilities)/enum-event-types';
import getSubject from '(utilities)/get-subject';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
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
  if (!subject) return notFound();

  return (
    <>
      <Header className="flex justify-between">
        <BackButton href="/subjects" />
        <div className="flex items-center justify-center gap-4">
          <Avatar file={subject.image_uri} name={subject.name} />
          <h1 className="truncate">{subject.name}</h1>
        </div>
        <IconButton
          href={`/subjects/${subject.id}/settings`}
          icon={<Cog6ToothIcon className="relative -right-[0.2em] w-7" />}
          label="Edit"
        />
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

export const dynamic = 'force-dynamic';
export default Page;
