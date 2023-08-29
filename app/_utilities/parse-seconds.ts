const parseSeconds = (s: string | number) => {
  let totalSeconds = Number(s);
  const hours = String(Math.floor(totalSeconds / 3600));
  totalSeconds %= 3600;
  const minutes = String(Math.floor(totalSeconds / 60));

  const secondsWithFraction = String(
    parseFloat((totalSeconds % 60).toFixed(2)),
  );

  const [seconds, fraction] = secondsWithFraction.split('.');

  return {
    fraction: (fraction ?? '0').padEnd(2, '0'),
    hasHours: hours !== '0',
    hasMinutes: minutes !== '0',
    hours: hours.padStart(2, '0'),
    minutes: minutes.padStart(2, '0'),
    seconds: seconds.padStart(2, '0'),
  };
};

export default parseSeconds;
