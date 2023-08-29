import parseSeconds from './parse-seconds';

interface Value {
  label?: string;
  value?: string | number | boolean;
}

const formatInputValue = {
  checkbox: (values: Value[]) => (values[0]?.value == true ? 'Yes' : 'No'),
  duration: (values: Value[]) => {
    const value = values[0]?.value;
    const t = parseSeconds(value as string);
    let s = '';
    if (t.hasHours) s += `${t.hours}:`;
    return `${s}${t.minutes}:${t.seconds}`;
  },
  multi_select: (values: Value[]) =>
    values
      .map(({ label }) => label)
      .join(', ')
      .replace(/, ([^,]+$)/, ', $1'),
  number: (values: Value[]) => values[0]?.value,
  select: (values: Value[]) => values[0]?.label,
  stopwatch: (values: Value[]) => {
    const t = parseSeconds(
      (values.find(({ label }) => !label)?.value as string) ?? '0',
    );

    let s = '';
    if (t.hasHours) s += `${t.hours}:`;
    return `${s}${t.minutes}:${t.seconds}`;
  },
};

export default formatInputValue;
