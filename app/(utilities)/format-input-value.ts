const formatInputValue = {
  checkbox: ([value]: (boolean | string)[]) => (value == true ? 'Yes' : 'No'),
  duration: ([value]: string[]) => `${value}s`,
  multi_select: (values: string[]) =>
    values.join(', ').replace(/, ([^,]+$)/, ', $1'),
  number: ([value]: string[]) => value,
  select: ([value]: string[]) => value,
};

export default formatInputValue;
