'use client';

import { usePathname } from 'next/navigation';
import Button from './button';

interface BreadcrumbProps {
  items: ([string, string] | [string])[];
}

const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const pathname = usePathname();

  return (
    <h1 className="ml-4 text-right">
      {items.length === 1 ? (
        <span className="text-2xl">{items[0]}</span>
      ) : (
        items.map(([label, href], i) => (
          <Button
            className="after:pl-[0.4rem] after:pr-[0.75rem] after:text-fg-3 after:content-['/'] last:after:hidden last-of-type:text-fg-1"
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
