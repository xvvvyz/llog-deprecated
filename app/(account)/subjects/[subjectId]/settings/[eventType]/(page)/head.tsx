import MetaTags from '(components)/meta-tags';
import EventTypes from '(utilities)/enum-event-types';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';

interface HeadProps {
  params: {
    eventType: EventTypes;
    subjectId: string;
  };
}

const Head = async ({ params: { eventType, subjectId } }: HeadProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <>
      <title>
        {formatTitle([subject.name, 'Settings', `Add ${eventType}`])}
      </title>
      <MetaTags />
    </>
  );
};

export default Head;
