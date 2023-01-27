import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';
import getTemplate from 'utilities/get-template';

interface HeadProps {
  params: {
    templateId: string;
  };
}

const Head = async ({ params: { templateId } }: HeadProps) => {
  const { data: template } = await getTemplate(templateId);
  if (!template) return null;

  return (
    <>
      <title>{formatTitle(['Templates', template.name])}</title>
      <MetaTags />
    </>
  );
};

export default Head;
