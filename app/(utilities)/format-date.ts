const formatDate = (input: Date | string) =>
  (input instanceof Date ? input : new Date(input)).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'long', weekday: 'long' }
  );

export default formatDate;
