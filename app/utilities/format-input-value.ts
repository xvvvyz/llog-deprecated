const formatInputValue = {
  checkbox: ([value]: string[]) => (value === 'true' ? 'Yes' : 'No'),
  duration: ([value]: string[]) => `${value}s`,
  multi_select: (values: string[]) =>
    values.join(', ').replace(/, ([^,]+$)/, ', $1'),
  number: ([value]: string[]) => value,
  select: ([value]: string[]) => value,
  time: ([value]: string[]) =>
    new Date(value).toLocaleString(undefined, {
      day: 'numeric',
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
      month: 'numeric',
      year: '2-digit',
    }),
};

export default formatInputValue;
