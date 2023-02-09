import formatMinFractionDigits from './format-min-fraction-digits';

const formatRoutineNumber = (value: number) =>
  formatMinFractionDigits({ value: value + 1 });

export default formatRoutineNumber;
