import Avatar from 'components/avatar';
import BackButton from 'components/back-button';
import Button from 'components/button';
import Header from 'components/header';
import { notFound } from 'next/navigation';
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
        <h1 className="w-1/2 truncate text-center text-2xl">{subject.name}</h1>
        <Avatar file={subject.image_uri} name={subject.name} />
      </Header>
      <main>
        <section>
          <Header>
            <h2 className="text-2xl text-fg-2">Missions</h2>
            <Button href={`/subjects/${subject.id}/missions/add`} size="sm">
              Add mission
            </Button>
          </Header>
          {/* @ts-expect-error Server Component */}
          <Missions subjectId={subjectId} />
        </section>
        <section>
          <Header>
            <h2 className="text-2xl text-fg-2">Timeline</h2>
            <Button href={`/subjects/${subject.id}/observation`} size="sm">
              Add observation
            </Button>
          </Header>
          {/* @ts-expect-error Server Component */}
          <Timeline subjectId={subjectId} />
        </section>
      </main>
    </>
  );
};

export default Page;
