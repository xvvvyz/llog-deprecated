'use client';

import Spinner from '@/_components/spinner';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

const colorSchemes = {
  accent:
    'ring-accent-2 bg-accent-1 text-bg-1 font-bold hover:bg-accent-2 ring-offset-bg-2 ring-offset-4',
  transparent:
    'ring-accent-2 hover:bg-alpha-1 font-normal text-fg-3 hover:text-fg-2',
};

const spinnerColorSchemes = {
  accent: 'border-bg-1',
  transparent: 'border-fg-2',
};

const sizes = {
  md: 'px-4 py-2',
  sm: 'px-4 py-1',
};

const variants = {
  link: 'p-3 -m-3 border-0 text-fg-3 hover:text-fg-2',
  primary: 'focus:ring-1 rounded justify-center',
};

const disabledVariants = {
  link: 'disabled',
  primary: 'disabled ring-transparent',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  activeClassName?: string;
  colorScheme?: keyof typeof colorSchemes;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  replace?: LinkProps['replace'];
  size?: keyof typeof sizes;
  target?: '_blank';
  variant?: keyof typeof variants;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      activeClassName,
      children,
      className,
      colorScheme = 'accent',
      disabled = false,
      href,
      loading = false,
      loadingText,
      size = 'md',
      variant = 'primary',
      ...rest
    },
    ref,
  ) => {
    const pathname = usePathname();
    const { pending } = useFormStatus();

    const cn = twMerge(
      'outline-none border [overflow-wrap:anywhere] border-alpha-3 items-center inline-flex gap-2 transition-colors',
      variant !== 'link' && sizes[size],
      variant !== 'link' && colorSchemes[colorScheme],
      variants[variant],
      (disabled || loading || pending) && disabledVariants[variant],
      href && pathname?.startsWith(href) && activeClassName,
      className,
    );

    if (href) {
      return (
        <Link
          aria-busy={loading || pending}
          aria-disabled={disabled}
          className={cn}
          href={href}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          {...(rest as Omit<LinkProps, 'href'>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        aria-disabled={disabled || loading || pending}
        className={cn}
        disabled={disabled || loading || pending}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type="button"
        {...rest}
      >
        {loading || pending ? (
          <>
            {variant !== 'link' && (
              <Spinner color={spinnerColorSchemes[colorScheme]} />
            )}
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export type { ButtonProps };
export default Button;
