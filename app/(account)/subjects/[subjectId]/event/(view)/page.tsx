import { ArrowRightIcon } from '@heroicons/react/24/outline';
import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Button from 'components/button';
import Empty from 'components/empty';
import Header from 'components/header';
import { List, ListItem } from 'components/list';
import { notFound } from 'next/navigation';
import getSubject from 'utilities/get-subject';
import listSubjectEventTypes from 'utilities/list-subject-event-types';
import EditSubjectLink from '../components/edit-subject-link';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventTypes }] = await Promise.all([
    getSubject(subjectId),
    listSubjectEventTypes(subjectId),
  ]);

  if (!subject) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], ['Event']]} />
      </Header>
      <main>
        {eventTypes?.length ? (
          <List>
            {eventTypes.map((eventType) => (
              <ListItem key={eventType.id}>
                <Button
                  className="m-0 h-full w-full p-0"
                  href={`${subjectHref}/event/${eventType.id}`}
                  variant="link"
                >
                  <span className="w-3/4 truncate">{eventType.name}</span>
                  <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6 shrink-0" />
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Empty>
            No observations or routines
            <EditSubjectLink subjectId={subjectId} />
          </Empty>
        )}
      </main>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
