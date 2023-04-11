import parseSeconds from './parse-seconds';

const formatInputValue = {
  checkbox: (values: any) => (values[0]?.value == true ? 'Yes' : 'No'),
  duration: (values: any) => {
    const value = values[0]?.value;
    const t = parseSeconds(value);
    let s = '';
    if (t.hasHours) s += `${t.hours}:`;
    return `${s}${t.minutes}:${t.seconds}`;
  },
  multi_select: (values: any) =>
    values
      .map(({ label }: any) => label)
      .join(', ')
      .replace(/, ([^,]+$)/, ', $1'),
  number: (values: any) => values[0]?.value,
  select: (values: any) => values[0]?.label,
  stopwatch: (values: any) => {
    const t = parseSeconds(values.find(({ label }: any) => !label).value);
    let s = '';
    if (t.hasHours) s += `${t.hours}:`;
    return `${s}${t.minutes}:${t.seconds}`;
  },
};

export default formatInputValue;
