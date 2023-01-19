import Card from 'components/card';
import Empty from 'components/empty';
import firstIfArray from 'utilities/first-if-array';
import forceArray from 'utilities/force-array';
import formatInputValue from 'utilities/format-input-value';
import listEvents from 'utilities/list-events';

interface TimelineProps {
  subjectId: string;
}

const Timeline = async ({ subjectId }: TimelineProps) => {
  const { data: events } = await listEvents(subjectId);
  if (!events?.length) return <Empty>No events</Empty>;

  return (
    <ul className="-mt-6 flex flex-col gap-3">
      {Object.entries(
        events.reduce((acc, event) => {
          const date = new Date(event.created_at).toLocaleDateString(
            undefined,
            { day: 'numeric', month: 'long', weekday: 'long' }
          );

          acc[date] = acc[date] ?? [];
          acc[date].push(event);
          return acc;
        }, {} as Record<string, typeof events>)
      ).map(([date, events]) => (
        <li className="flex flex-col gap-3" key={date}>
          <time className="ml-6 flex h-16 items-end justify-end border-l-2 border-dashed border-alpha-2 text-fg-2">
            {date}
          </time>
          {events.map((event) => {
            const eventType = firstIfArray(event.type);

            const time = new Date(event.created_at).toLocaleTimeString(
              undefined,
              { timeStyle: 'short' }
            );

            const inputs: [
              string,
              {
                label: string;
                type: keyof typeof formatInputValue;
                values: string[];
              }
            ][] = Object.entries(
              forceArray(event.inputs).reduce(
                (acc, { input, input_option, value }) => {
                  acc[input.id] = acc[input.id] ?? { values: [] };
                  acc[input.id].label = input.label;
                  acc[input.id].type = input.type;
                  acc[input.id].values.push(value ?? input_option.label);
                  return acc;
                },
                {}
              )
            );

            return (
              <Card
                as="article"
                className="overflow-hidden"
                key={event.id}
                size="0"
              >
                <header className="flex justify-between p-6">
                  <h3 className="font-bold">{eventType?.name}</h3>
                  <time className="text-fg-2">{time}</time>
                </header>
                {!!inputs.length && (
                  <ul className="flex flex-col">
                    {inputs.map(([id, { label, type, values }]) => (
                      <li
                        className="grid grid-cols-2 border-t border-alpha-1 py-3 px-6"
                        key={id}
                      >
                        <span className="pr-3 text-fg-2">{label}</span>
                        <span>{formatInputValue[type](values)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </li>
      ))}
    </ul>
  );
};

export default Timeline;
