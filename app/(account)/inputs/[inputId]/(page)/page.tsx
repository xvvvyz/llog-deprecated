import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Card from '(components)/card';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import getInput from '(utilities)/get-input';
import { notFound } from 'next/navigation';
import InputForm from '../../(components)/input-form';

interface PageProps {
  params: {
    inputId: string;
  };
}

const Page = async ({ params: { inputId } }: PageProps) => {
  const { data: input } = await getInput(inputId);
  if (!input) notFound();

  return (
    <>
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], [input.label]]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <InputForm input={input} />
      </Card>
    </>
  );
};

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params: { inputId } }: PageProps) => {
  const { data: input } = await getInput(inputId);
  if (!input) return;
  return { title: formatTitle(['Inputs', input.label]) };
};

export default Page;
