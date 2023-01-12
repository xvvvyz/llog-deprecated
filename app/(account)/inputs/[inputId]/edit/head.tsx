import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';
import getInput from 'utilities/get-input';

interface HeadProps {
  params: {
    inputId: string;
  };
}

const Head = async ({ params: { inputId } }: HeadProps) => {
  const { data: input } = await getInput(inputId);
  if (!input) return null;

  return (
    <>
      <title>{formatTitle([input.label, 'Edit'])}</title>
      <MetaTags />
    </>
  );
};

export default Head;
