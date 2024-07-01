import humanizeDuration from 'humanize-duration';

const humanizeDurationShort = humanizeDuration.humanizer({
  delimiter: ' ',
  language: 'short',
  languages: {
    short: {
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      mo: () => 'mo',
      ms: () => 'ms',
      s: () => 's',
      w: () => 'w',
      y: () => 'y',
    },
  },
  largest: 2,
  round: true,
  spacer: '',
});

export default humanizeDurationShort;
