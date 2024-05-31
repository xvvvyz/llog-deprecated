import { ListInputLabelsByIdData } from '@/_queries/list-input-labels-by-id';

const formatInputIdLabelMap = (inputs: ListInputLabelsByIdData) =>
  (inputs ?? []).reduce<Record<string, string>>((acc, input) => {
    acc[input.id] = input.label;
    return acc;
  }, {});

export default formatInputIdLabelMap;
