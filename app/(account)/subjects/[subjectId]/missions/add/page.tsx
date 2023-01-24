import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import { notFound } from 'next/navigation';
import TemplateTypes from 'utilities/enum-template-types';
import getSubject from 'utilities/get-subject';
import listInputs from 'utilities/list-inputs';
import listTemplates from 'utilities/list-templates';
import MissionForm from '../components/mission-form';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: availableInputs },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    listInputs(),
    listTemplates(TemplateTypes.Routine),
  ]);

  if (!subject) return notFound();
  const subjectHref = `/subjects/${subjectId}`;

  return (
    <>
      <Header>
        <BackButton href={subjectHref} />
        <Breadcrumbs
          items={[
            [subject.name, subjectHref],
            ['Missions', subjectHref],
            ['Add'],
          ]}
        />
      </Header>
      <Card as="main" breakpoint="sm">
        <MissionForm
          availableInputs={availableInputs}
          availableTemplates={availableTemplates}
          subjectId={subjectId}
        />
      </Card>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
