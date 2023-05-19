// reference: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx'],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    borderRadius: {
      DEFAULT: 'var(--radius-default)',
      full: '50%',
      none: '0',
      sm: 'var(--radius-sm)',
    },
    colors: {
      'accent-1': 'var(--color-accent-1)',
      'accent-2': 'var(--color-accent-2)',
      'alpha-1': 'var(--color-alpha-1)',
      'alpha-2': 'var(--color-alpha-2)',
      'alpha-3': 'var(--color-alpha-3)',
      'alpha-4': 'var(--color-alpha-4)',
      'alpha-reverse-1': 'var(--color-alpha-reverse-1)',
      'alpha-reverse-2': 'var(--color-alpha-reverse-2)',
      'bg-1': 'var(--color-bg-1)',
      'bg-2': 'var(--color-bg-2)',
      'fg-1': 'var(--color-fg-1)',
      'fg-2': 'var(--color-fg-2)',
      'fg-3': 'var(--color-fg-3)',
      transparent: 'transparent',
      white: 'var(--color-white)',
    },
    fontFamily: {
      body: 'var(--font-body)',
      mono: 'var(--font-mono)',
    },
    fontWeight: {
      bold: 'var(--font-weight-bold)',
      normal: 'var(--font-weight-normal)',
    },
    screens: {
      lg: '56rem',
      md: '42rem',
      sm: '32rem',
      xs: '25rem',
    },
    typography: {
      DEFAULT: {
        css: {
          a: {
            '&:hover': {
              // hack because prose-a:hover:text-fg-1 is highlighting all links
              color: 'var(--color-fg-1)',
            },
          },
        },
      },
    },
  },
};
