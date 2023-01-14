'use client';

import { usePathname } from 'next/navigation';
import Button from './button';

interface BreadcrumbProps {
  items: ([string, string] | [string])[];
}

const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const pathname = usePathname();

  return (
    <h1 className="ml-6">
      {items.length === 1 ? (
        <span className="text-2xl">{items[0]}</span>
      ) : (
        items.map(([label, href]) => (
          <Button
            className="ml-1 text-fg-2 after:ml-1 after:text-fg-2 after:content-['/'] last:after:hidden last-of-type:text-fg-1"
            href={href ?? pathname ?? '#'}
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
