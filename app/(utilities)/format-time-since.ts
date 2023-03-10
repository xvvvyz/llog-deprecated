const ranges = {
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  months: 3600 * 24 * 30,
  seconds: 1,
  weeks: 3600 * 24 * 7,
  years: 3600 * 24 * 365,
};

const formatTimeSince = (input: Date | string) => {
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat();
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const key in ranges) {
    const k = key as keyof typeof ranges;
    if (ranges[k] >= Math.abs(secondsElapsed)) continue;
    const delta = secondsElapsed / ranges[k];
    return formatter.format(Math.round(delta), k);
  }
};

export default formatTimeSince;
