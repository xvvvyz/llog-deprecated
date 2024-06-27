import { IOption } from '@/_components/select';
import { ListEventsData } from '@/_queries/list-events';

const getInsightOptionsFromEvents = (events: NonNullable<ListEventsData>) => {
  const inputOptions: Array<IOption> = [];

  for (const event of events) {
    for (const i of event.inputs) {
      if (!inputOptions.some((o) => o.id === i.input?.id)) {
        inputOptions.push(i.input as IOption);
      }
    }
  }

  return {
    inputOptions: inputOptions.sort((a, b) =>
      (a.label as string).localeCompare(b.label as string),
    ),
  };
};

export default getInsightOptionsFromEvents;
