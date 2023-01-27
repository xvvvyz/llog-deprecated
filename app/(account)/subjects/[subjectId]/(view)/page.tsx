import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Avatar from 'components/avatar';
import BackButton from 'components/back-button';
import Button from 'components/button';
import Header from 'components/header';
import IconButton from 'components/icon-button';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import getSubject from 'utilities/get-subject';
import Missions from './components/missions';
import Timeline from './components/timeline';

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
        <div className="flex items-center justify-center gap-6">
          <Avatar file={subject.image_uri} name={subject.name} />
          <h1 className="truncate">{subject.name}</h1>
        </div>
        <IconButton
          href={`/subjects/${subject.id}/settings`}
          icon={<Cog6ToothIcon className="relative -right-1 w-9" />}
          label="Edit"
        />
      </Header>
      <main>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <Missions subjectId={subjectId} />
        </Suspense>
        <div className="mt-12 grid grid-cols-2 gap-3">
          <Button colorScheme="transparent" disabled>
            Add note
          </Button>
          <Button href={`/subjects/${subject.id}/event`}>Add event</Button>
        </div>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <Timeline subjectId={subjectId} />
        </Suspense>
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
