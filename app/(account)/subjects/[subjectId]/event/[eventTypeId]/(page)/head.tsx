import MetaTags from '(components)/meta-tags';
import formatTitle from '(utilities)/format-title';
import getEventType from '(utilities)/get-event-type';
import getSubject from '(utilities)/get-subject';

interface HeadProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

const Head = async ({ params: { eventTypeId, subjectId } }: HeadProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventType(eventTypeId),
  ]);

  if (!subject || !eventType) return null;

  return (
    <>
      <title>
        {formatTitle([subject.name, 'Event', eventType.name ?? ''])}
      </title>
      <MetaTags />
    </>
  );
};

export default Head;
