'use client';

import Spinner from '(components)/spinner';
import Link, { LinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const colorSchemes = {
  accent:
    'ring-accent-2 bg-accent-1 text-bg-1 font-bold hover:bg-accent-2 ring-offset-bg-2 ring-offset-4',
  transparent:
    'ring-accent-2 border-alpha-2 font-normal hover:border-alpha-3 bg-transparent text-fg-2 hover:text-fg-1',
};

const spinnerColorSchemes = {
  accent: 'border-bg-1',
  transparent: 'border-fg-1',
};

const sizes = {
  md: 'px-4 py-2',
  sm: 'px-4 py-1',
};

const variants = {
  link: 'p-3 -m-3 text-fg-2 hover:text-fg-1',
  primary: 'focus:ring-1 justify-center',
};

const disabledVariants = {
  link: 'pointer-events-none text-alpha-3',
  primary: 'disabled ring-transparent',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  activeClassName?: string;
  colorScheme?: keyof typeof colorSchemes;
  forwardSearchParams?: boolean;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      activeClassName,
      children,
      className,
      colorScheme = 'accent',
      disabled = false,
      forwardSearchParams = false,
      href,
      loading = false,
      loadingText,
      size = 'md',
      variant = 'primary',
      ...rest
    },
    ref
  ) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const cn = twMerge(
      'outline-none border border-transparent inline-flex items-center gap-2 rounded transition-colors',
      variant !== 'link' && sizes[size],
      variant !== 'link' && colorSchemes[colorScheme],
      variants[variant],
      (disabled || loading) && disabledVariants[variant],
      href && pathname?.startsWith(href) && activeClassName,
      className
    );

    if (href) {
      const searchString = forwardSearchParams
        ? `?${searchParams.toString()}`
        : '';

      return (
        <Link
          aria-busy={loading}
          aria-disabled={disabled}
          className={cn}
          href={`${href}${searchString}`}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          {...(rest as Omit<LinkProps, 'href'>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        aria-disabled={disabled || loading}
        className={cn}
        disabled={disabled || loading}
        ref={ref}
        type="button"
        {...rest}
      >
        {loading ? (
          <>
            {variant !== 'link' && (
              <Spinner
                className={twMerge(
                  spinnerColorSchemes[colorScheme],
                  'border-l-transparent'
                )}
              />
            )}
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export type { ButtonProps };
export default Button;
