import { IOption } from '@/_components/select';
import InputType from '@/_constants/enum-input-type';
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
  const inputOptionsOptions: Record<string, Array<IOption>> = {};
  const protocolOptions: Array<IOption> = [];

  for (const event of events) {
    const et = firstIfArray(event.type);
    if (!et) continue;
    let inputIdMatch = false;

    for (const { input, option } of event.inputs) {
      if (input?.id && !inputOptions.some((o) => o.id === input?.id)) {
        inputOptions.push({ id: input.id, label: input.label });
      }

      if (
        input?.id &&
        option?.id &&
        !inputOptionsOptions[input.id]?.some((o) => o.id === option.id)
      ) {
        if (inputOptionsOptions[input.id]) {
          inputOptionsOptions[input.id].push(option);
        } else {
          inputOptionsOptions[input.id] = [option];
        }
      } else if (
        input?.type === InputType.Checkbox &&
        !inputOptionsOptions[input.id]
      ) {
        inputOptionsOptions[input.id] = [
          { id: 'true', label: 'Yes' },
          { id: 'false', label: 'No' },
        ];
      }

      if (input?.id === inputId) {
        inputIdMatch = true;
      }
    }

    if (!inputIdMatch) continue;
    const tp = et.session?.protocol;

    if (!et.session && !eventTypeOptions.some((o) => o.id === et.id)) {
      eventTypeOptions.push({ id: et.id, label: et.name as string });
    } else if (tp?.name && !protocolOptions.some((o) => o.id === tp?.id)) {
      protocolOptions.push({ id: tp.id, label: tp.name });
    }
  }
  const sortedEventTypeOptions = sortBy(eventTypeOptions, 'label');
  const sortedProtocolOptions = sortBy(protocolOptions, 'label');

  return {
    eventTypeOptions: sortedEventTypeOptions,
    eventTypeOrProtocolOptions: [
      { label: 'Event types', options: sortedEventTypeOptions },
      { label: 'Protocols', options: sortedProtocolOptions },
    ],
    inputOptions: sortBy(inputOptions, 'label'),
    inputOptionsOptions: Object.fromEntries(
      Object.entries(inputOptionsOptions).map(([key, value]) => [
        key,
        sortBy(value, 'label'),
      ]),
    ),
    protocolOptions: sortedProtocolOptions,
  };
};

export default getInsightOptionsFromEvents;
