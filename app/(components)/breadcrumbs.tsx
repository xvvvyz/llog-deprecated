'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import Button from './button';

interface BreadcrumbProps {
  items: ([string, string | undefined] | [string])[];
}

const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filteredItems = items.filter((item) => item[0]);

  return (
    <h1
      className={twMerge(
        'ml-4 text-right',
        searchParams.has('back') && 'disabled'
      )}
    >
      {filteredItems.length === 1 ? (
        <span className="text-2xl">{items[0]}</span>
      ) : (
        filteredItems.map(([label, href], i) => (
          <Button
            className="after:pl-1.5 after:pr-3 after:text-fg-3 after:content-['/'] last:after:hidden last-of-type:text-fg-1"
            disabled={!href && i < items.length - 1}
            href={href ?? pathname ?? undefined}
            key={label}
            variant="link"
          >
            {label}
          </Button>
        ))
      )}
    </h1>
  );
};

export default Breadcrumbs;
