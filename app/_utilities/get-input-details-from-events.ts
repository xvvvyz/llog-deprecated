import NOMINAL_INPUT_TYPES from '@/_constants/constant-nominal-input-types';
import InputType from '@/_constants/enum-input-type';
import { ListEventsData } from '@/_queries/list-events';

const getInputDetailsFromEvents = ({
  events,
  inputId,
}: {
  events: NonNullable<ListEventsData>;
  inputId: string;
}) => {
  let input = null;

  eventsLoop: for (const event of events) {
    for (const i of event.inputs) {
      if (i.input?.id === inputId) {
        input = i.input;
        break eventsLoop;
      }
    }
  }

  return {
    input,
    isInputNominal: NOMINAL_INPUT_TYPES.includes(input?.type as InputType),
  };
};

export default getInputDetailsFromEvents;
