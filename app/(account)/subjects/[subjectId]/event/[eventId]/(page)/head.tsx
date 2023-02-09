import MetaTags from '(components)/meta-tags';
import firstIfArray from '(utilities)/first-if-array';
import formatTitle from '(utilities)/format-title';
import getEvent from '(utilities)/get-event';
import getSubject from '(utilities)/get-subject';

interface HeadProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

const Head = async ({ params: { eventId, subjectId } }: HeadProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  if (!subject || !event) return null;
  const eventType = firstIfArray(event.type);

  return (
    <>
      <title>
        {formatTitle([
          subject.name,
          eventType.name ?? eventType.mission?.name ?? '',
        ])}
      </title>
      <MetaTags />
    </>
  );
};

export default Head;
