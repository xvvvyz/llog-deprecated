import { ArrowRightIcon } from '@heroicons/react/24/solid';
import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Button from 'components/button';
import Empty from 'components/empty';
import Header from 'components/header';
import { List, ListItem } from 'components/list';
import { notFound } from 'next/navigation';
import firstIfArray from 'utilities/first-if-array';
import getSubject from 'utilities/get-subject';
import getSubjectObservations from 'utilities/get-subject-observations';
import EditSubjectLink from './components/edit-subject-link';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: observations }] = await Promise.all([
    getSubject(subjectId),
    getSubjectObservations(subjectId),
  ]);

  if (!subject) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], ['Observation']]} />
      </Header>
      <main>
        <List>
          {observations?.length ? (
            observations.map((data) => {
              const observation = firstIfArray(data.observation);
              if (!observation) return null;

              return (
                <ListItem key={observation.id}>
                  <Button
                    className="mx-0 flex h-full w-full items-center gap-6 px-0"
                    href={`${subjectHref}/observation/${observation.id}`}
                    variant="link"
                  >
                    <span className="w-3/4 truncate">{observation.name}</span>
                    <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6 shrink-0" />
                  </Button>
                </ListItem>
              );
            })
          ) : (
            <Empty>
              No observations enabled
              <EditSubjectLink subjectId={subjectId} />
            </Empty>
          )}
        </List>
      </main>
    </>
  );
};

export default Page;
