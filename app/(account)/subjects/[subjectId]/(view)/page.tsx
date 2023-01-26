import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Avatar from 'components/avatar';
import BackButton from 'components/back-button';
import Button from 'components/button';
import Header from 'components/header';
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
      <Header>
        <BackButton href="/subjects" />
        <div className="flex items-center justify-center gap-6">
          <Avatar file={subject.image_uri} name={subject.name} />
          <h1 className="truncate">{subject.name}</h1>
        </div>
        <Button href={`/subjects/${subject.id}/edit`} variant="link">
          <Cog6ToothIcon className="relative -right-1 w-9" />
          <span className="sr-only">Edit</span>
        </Button>
      </Header>
      <main>
        <section>
          <Header>
            <h2 className="text-2xl">Missions</h2>
            <Button href={`/subjects/${subject.id}/missions/add`} size="sm">
              Add mission
            </Button>
          </Header>
          <Suspense>
            {/* @ts-expect-error Server Component */}
            <Missions subjectId={subjectId} />
          </Suspense>
        </section>
        <section>
          <Header className="mb-0 h-auto flex-col items-start gap-9">
            <h2 className="text-2xl">Timeline</h2>
            <div className="flex w-full gap-3">
              <Button className="w-full" colorScheme="transparent" disabled>
                Add note
              </Button>
              <Button className="w-full" href={`/subjects/${subject.id}/event`}>
                Add event
              </Button>
            </div>
          </Header>
          <Suspense>
            {/* @ts-expect-error Server Component */}
            <Timeline subjectId={subjectId} />
          </Suspense>
        </section>
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
