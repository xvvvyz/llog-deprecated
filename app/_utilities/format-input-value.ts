import humanizeDuration from 'humanize-duration';

interface Value {
  label?: string;
  value?: string | number | boolean;
}

const formatInputValue = {
  checkbox: (values: Value[]) => (values[0]?.value == true ? 'Yes' : 'No'),
  duration: (values: Value[]) =>
    humanizeDuration(Number(values[0]?.value ?? '0') * 1000, {
      largest: 2,
      round: true,
    }),
  multi_select: (values: Value[]) =>
    values
      .map(({ label }) => label)
      .join(', ')
      .replace(/, ([^,]+$)/, ', $1'),
  number: (values: Value[]) => values[0]?.value,
  select: (values: Value[]) => values[0]?.label,
  stopwatch: (values: Value[]) =>
    humanizeDuration(
      Number(values.find(({ label }) => !label)?.value ?? '0') * 1000,
      { largest: 2, round: true },
    ),
};

export default formatInputValue;
