import InputType from './enum-input-type';

const INPUT_LABELS = {
  [InputType.Checkbox]: 'Yes / no',
  [InputType.Duration]: 'Duration',
  [InputType.MultiSelect]: 'Select multiple',
  [InputType.Number]: 'Number',
  [InputType.Select]: 'Select',
  [InputType.Stopwatch]: 'Stopwatch',
};

export default INPUT_LABELS;
