'use client';

import Spinner from '@/_components/spinner';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

const colorSchemes = {
  accent:
    'ring-accent-2 bg-accent-1 text-bg-1 font-bold active:bg-accent-2 hover:bg-accent-2 ring-offset-bg-2 ring-offset-4',
  transparent:
    'ring-accent-2 hover:bg-alpha-1 font-normal active:text-fg-2 active:bg-alpha-1 text-fg-3 hover:text-fg-2',
};

const spinnerColorSchemes = {
  accent: 'border-bg-1',
  transparent: 'border-fg-2',
};

const sizes = {
  md: 'px-4 py-2 rounded',
  sm: 'px-4 py-1 rounded-sm',
};

const variants = {
  link: 'p-3 -m-3 border-0 text-fg-3 hover:text-fg-2 active:text-fg-2',
  primary: 'focus:ring-1 justify-center',
};

const disabledVariants = {
  link: 'disabled',
  primary: 'disabled ring-transparent',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  activeClassName?: string;
  colorScheme?: keyof typeof colorSchemes;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  replace?: LinkProps['replace'];
  scroll?: boolean;
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
      scroll = true,
      type = 'button',
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
      href && pathname?.startsWith(href.split('?')[0]) && activeClassName,
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
          scroll={scroll}
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
        type={type}
        {...rest}
      >
        {loading || (type === 'submit' && pending) ? (
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

export default Button;
