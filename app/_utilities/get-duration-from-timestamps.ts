import humanizeDurationShort from '@/_utilities/humanize-duration-short';

const getDurationFromTimestamps = (start: string, end: string) =>
  humanizeDurationShort(new Date(end).getTime() - new Date(start).getTime(), {
    largest: 1,
  });

export default getDurationFromTimestamps;
