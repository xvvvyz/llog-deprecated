import MetaTags from '(components)/meta-tags';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';

interface HeadProps {
  params: {
    subjectId: string;
  };
}

const Head = async ({ params: { subjectId } }: HeadProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <>
      <title>{formatTitle([subject.name, 'Settings', 'Add mission'])}</title>
      <MetaTags />
    </>
  );
};

export default Head;
