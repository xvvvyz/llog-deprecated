const formatMinFractionDigits = ({ minimumFractionDigits = 1, value = 0 }) =>
  Intl.NumberFormat(undefined, { minimumFractionDigits }).format(value);

export default formatMinFractionDigits;
