import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getEventTypeWithInputsAndOptions from '@/(account)/_server/get-event-type-with-inputs-and-options';
import getSubject from '@/(account)/_server/get-subject';
import formatTitle from '@/(account)/_utilities/format-title';
import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: type }, user] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
    getCurrentUser(),
  ]);

  if (!subject || !type || !user) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [type.name ?? ''],
          ]}
        />
      </Header>
      <EventCard eventType={type} subjectId={subjectId} userId={user.id} />
    </>
  );
};

export const generateMetadata = async ({
  params: { eventTypeId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
  ]);

  if (!subject || !eventType) return;
  return { title: formatTitle([subject.name, eventType.name]) };
};

export default Page;
