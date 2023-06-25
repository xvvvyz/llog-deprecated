import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import IconButton from '@/(account)/_components/icon-button';
import LinkList from '@/(account)/_components/link-list';
import getMissionWithSessions from '@/(account)/_server/get-mission-with-sessions';
import getSubject from '@/(account)/_server/get-subject';
import forceArray from '@/(account)/_utilities/force-array';
import formatDateTime from '@/(account)/_utilities/format-date-time';
import formatTitle from '@/(account)/_utilities/format-title';
import Button from '@/_components/button';
import { PencilIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
  ]);

  return {
    title: formatTitle([subject?.name, mission?.name, 'Sessions']),
  };
};

export const revalidate = 0;

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
  ]);

  if (!subject || !mission) notFound();
  const sessions = forceArray(mission.sessions).reverse();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          className="text-center"
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [mission.name],
          ]}
        />
        <IconButton
          href={`/subjects/${subjectId}/missions/${missionId}/edit`}
          icon={<PencilIcon className="relative -left-[0.16em] w-7" />}
          label="Edit"
        />
      </Header>
      <Header className="-mt-3">
        <h1 className="text-2xl">Sessions</h1>
        <Button
          href={`/subjects/${subjectId}/missions/${missionId}/sessions/create/${sessions.length}`}
          size="sm"
        >
          Add session
        </Button>
      </Header>
      {sessions.length ? (
        <LinkList>
          {sessions.map((session) => (
            <LinkList.Item
              href={`/subjects/${subjectId}/missions/${missionId}/sessions/${session.id}/edit`}
              icon="edit"
              key={session.id}
              pill={
                new Date(session.scheduled_for) > new Date()
                  ? formatDateTime(session.scheduled_for)
                  : undefined
              }
              text={
                <>
                  Session {session.order + 1}
                  {!!session.title && (
                    <span className="text-fg-3"> - {session.title}</span>
                  )}
                </>
              }
            />
          ))}
        </LinkList>
      ) : (
        <Empty>No sessions</Empty>
      )}
    </>
  );
};

export default Page;
