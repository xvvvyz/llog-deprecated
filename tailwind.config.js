import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx'],
  plugins: [typography],
  theme: {
    borderRadius: {
      DEFAULT: 'var(--radius-default)',
      full: '50%',
      none: '0',
      sm: 'var(--radius-sm)',
    },
    extend: {
      colors: {
        'accent-1': 'var(--color-accent-1)',
        'accent-2': 'var(--color-accent-2)',
        'alpha-0': 'var(--color-alpha-0)',
        'alpha-1': 'var(--color-alpha-1)',
        'alpha-2': 'var(--color-alpha-2)',
        'alpha-3': 'var(--color-alpha-3)',
        'alpha-4': 'var(--color-alpha-4)',
        'alpha-reverse-1': 'var(--color-alpha-reverse-1)',
        'alpha-reverse-2': 'var(--color-alpha-reverse-2)',
        'bg-1': 'var(--color-bg-1)',
        'bg-2': 'var(--color-bg-2)',
        'bg-3': 'var(--color-bg-3)',
        'fg-1': 'var(--color-fg-1)',
        'fg-2': 'var(--color-fg-2)',
        'fg-3': 'var(--color-fg-3)',
        'fg-4': 'var(--color-fg-4)',
        'red-1': 'var(--color-red-1)',
        transparent: 'transparent',
      },
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
      xl: '64rem',
      xs: '25rem',
    },
    typography: {
      DEFAULT: {
        css: {
          a: {
            '&:hover': {
              // hack because prose-a:hover:text-fg-2 is highlighting all links
              color: 'var(--color-fg-2)',
            },
          },
        },
      },
    },
  },
};
