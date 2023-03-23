import parseSeconds from './parse-seconds';

const formatInputValue = {
  checkbox: ([{ value }]: any) => (value == true ? 'Yes' : 'No'),
  duration: ([{ value }]: any) => {
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
  number: ([{ value }]: any) => value,
  select: ([{ label }]: any) => label,
  stopwatch: (values: any) => {
    const t = parseSeconds(values.find(({ label }: any) => !label).value);
    let s = '';
    if (t.hasHours) s += `${t.hours}:`;
    return `${s}${t.minutes}:${t.seconds}`;
  },
};

export default formatInputValue;
