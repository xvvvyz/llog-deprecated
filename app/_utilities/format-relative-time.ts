const formatRelativeTime = (input?: Date | string) => {
  if (!input) return input;
  const utcDate = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat();

  // order matters, do not sort!
  const ranges = {
    years: 3600 * 24 * 365,
    // eslint-disable-next-line sort-keys
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    // eslint-disable-next-line sort-keys
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };

  const secondsElapsed = (utcDate.getTime() - Date.now()) / 1000;

  for (const [key, value] of Object.entries(ranges)) {
    if (value < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / value;

      return formatter.format(
        Math.round(delta),
        key as Intl.RelativeTimeFormatUnit,
      );
    }
  }

  return 'just now';
};

export default formatRelativeTime;
