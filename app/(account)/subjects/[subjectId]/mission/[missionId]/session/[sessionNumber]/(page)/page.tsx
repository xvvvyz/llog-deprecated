import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getMission from '(utilities)/get-mission';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Session from './(components)/session';
import SessionPaginator from './(components)/session-paginator';

interface PageProps {
  params: {
    missionId: string;
    sessionNumber: string;
    subjectId: string;
  };
}

const Page = async ({
  params: { missionId, sessionNumber, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission) notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs items={[[subject.name, subjectHref], [mission.name]]} />
      </Header>
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <SessionPaginator
          missionId={mission.id}
          sessionNumber={Number(sessionNumber)}
          subjectId={subjectId}
        />
      </Suspense>
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <Session
          mission={mission}
          sessionNumber={sessionNumber}
          subjectId={subjectId}
        />
      </Suspense>
    </>
  );
};

export const generateMetadata = async ({
  params: { missionId, sessionNumber, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission || !sessionNumber) return;
  return { title: formatTitle([subject.name, mission.name, sessionNumber]) };
};

export const revalidate = 0;
export default Page;
