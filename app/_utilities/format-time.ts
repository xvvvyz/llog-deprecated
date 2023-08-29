const formatTime = (input: Date | string) =>
  (input instanceof Date ? input : new Date(input)).toLocaleTimeString(
    undefined,
    { timeStyle: 'short' },
  );

export default formatTime;
