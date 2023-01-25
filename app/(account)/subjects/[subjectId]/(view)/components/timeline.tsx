import Avatar from 'components/avatar';
import Card from 'components/card';
import Empty from 'components/empty';
import { twMerge } from 'tailwind-merge';
import firstIfArray from 'utilities/first-if-array';
import forceArray from 'utilities/force-array';
import formatInputValue from 'utilities/format-input-value';
import listEvents from 'utilities/list-events';
import sanitizeHtml from 'utilities/sanitize-html';
import CommentForm from './comment-form';

interface TimelineProps {
  subjectId: string;
}

const Timeline = async ({ subjectId }: TimelineProps) => {
  const { data: events } = await listEvents(subjectId);
  if (!events?.length) return <Empty>No events</Empty>;

  return Object.entries(
    events.reduce((acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
      });

      acc[date] = acc[date] ?? [];
      acc[date].push(event);
      return acc;
    }, {} as Record<string, typeof events>)
  ).map(([date, events]) => (
    <div className="mt-9 flex flex-col gap-6 text-fg-2" key={date}>
      <time className="-mb-2 text-right">{date}</time>
      {events.map((event) => {
        const eventType = firstIfArray(event.type);
        const comments = forceArray(event.comments);

        const time = new Date(event.created_at).toLocaleTimeString(undefined, {
          timeStyle: 'short',
        });

        const inputs: [
          string,
          {
            label: string;
            type: keyof typeof formatInputValue;
            values: string[];
          }
        ][] = Object.entries(
          forceArray(event.inputs).reduce((acc, { input, option, value }) => {
            acc[input.id] = acc[input.id] ?? { values: [] };
            acc[input.id].label = input.label;
            acc[input.id].type = input.type;
            acc[input.id].values.push(value ?? option.label);
            return acc;
          }, {})
        );

        return (
          <Card as="article" key={event.id} size="0">
            <header className="flex justify-between p-4">
              <h3 className="text-fg-1">{eventType?.name}</h3>
              <time>{time}</time>
            </header>
            {!!inputs.length && (
              <ul
                className={twMerge(
                  'mb-2 flex flex-col divide-y divide-alpha-1 border-t border-alpha-1',
                  !!comments.length && 'border-b'
                )}
              >
                {inputs.map(([id, { label, type, values }]) => (
                  <li className="grid grid-cols-2 py-2 px-4" key={id}>
                    <span className="pr-3">{label}</span>
                    <span>{formatInputValue[type](values)}</span>
                  </li>
                ))}
              </ul>
            )}
            {!!comments.length && (
              <ul className="mb-2">
                {comments.map(({ content, id, profile }) => (
                  <li className="flex items-start gap-4 px-4 py-2" key={id}>
                    <Avatar
                      className="shrink-0"
                      name={profile.first_name}
                      size="sm"
                    />
                    <div className="-mt-1 w-full">
                      <span>
                        {profile.first_name} {profile.last_name}
                      </span>
                      <div
                        className="prose space-y-1 text-fg-1"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(content),
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <CommentForm eventId={event.id} />
          </Card>
        );
      })}
    </div>
  ));
};

export default Timeline;
