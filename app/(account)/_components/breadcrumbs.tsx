'use client';

import Button from '@/_components/button';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface BreadcrumbProps {
  className?: string;
  items: string[][];
}

const Breadcrumbs = ({ className, items }: BreadcrumbProps) => {
  const pathname = usePathname();
  const filteredItems = items.filter((item) => item[0]);

  return (
    <h1 className={twMerge('text-right', className)}>
      {filteredItems.length === 1 ? (
        <span className="text-2xl">{items[0]}</span>
      ) : (
        filteredItems.map(([label, href], i) => (
          <Button
            className="items-end after:pl-1.5 after:pr-3 after:text-alpha-4 after:content-['/'] last:after:hidden last-of-type:text-fg-1"
            disabled={!href && i < items.length - 1}
            href={href ?? pathname ?? undefined}
            key={label}
            variant="link"
          >
            <div className="max-w-[10rem] truncate">{label}</div>
          </Button>
        ))
      )}
    </h1>
  );
};

export default Breadcrumbs;
