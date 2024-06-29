import { IOption } from '@/_components/select';
import { ListEventsData } from '@/_queries/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import { sortBy } from 'lodash';

const getInsightOptionsFromEvents = ({
  events,
  inputId,
}: {
  events: NonNullable<ListEventsData>;
  inputId: string;
}) => {
  const eventTypeOptions: Array<IOption> = [];
  const inputOptions: Array<IOption> = [];
  const trainingPlanOptions: Array<IOption> = [];

  for (const event of events) {
    const et = firstIfArray(event.type);
    if (!et) continue;
    let inputIdMatch = false;

    for (const { input } of event.inputs) {
      if (input?.id && !inputOptions.some((o) => o.id === input?.id)) {
        inputOptions.push({ id: input.id, label: input.label });
      }

      if (input?.id === inputId) {
        inputIdMatch = true;
      }
    }

    if (!inputIdMatch) continue;
    const tp = et.session?.mission;

    if (et.name && !eventTypeOptions.some((o) => o.id === et.id)) {
      eventTypeOptions.push({ id: et.id, label: et.name });
    } else if (tp?.name && !trainingPlanOptions.some((o) => o.id === tp?.id)) {
      trainingPlanOptions.push({ id: tp.id, label: tp.name });
    }
  }

  return {
    eventTypeOptions: sortBy(eventTypeOptions, 'label'),
    inputOptions: sortBy(inputOptions, 'label'),
    trainingPlanOptions: sortBy(trainingPlanOptions, 'label'),
  };
};

export default getInsightOptionsFromEvents;
