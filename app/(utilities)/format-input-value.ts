import parseSeconds from './parse-seconds';

const formatInputValue = {
  checkbox: ([value]: (boolean | string)[]) => (value == true ? 'Yes' : 'No'),
  duration: ([value]: string[]) => {
    const [hours, minutes, seconds] = parseSeconds(value);
    let res = '';
    if (hours) res += `${hours}h`;
    if (minutes) res += ` ${minutes}m`;
    if (seconds) res += ` ${seconds}s`;
    return res.trim() || '0s';
  },
  multi_select: (values: string[]) =>
    values.join(', ').replace(/, ([^,]+$)/, ', $1'),
  number: ([value]: string[]) => value,
  select: ([value]: string[]) => value,
};

export default formatInputValue;
