import * as Breadcrumb from '@/_components/breadcrumb';
import { ReactNode } from 'react';

interface BreadcrumbsProps {
  isPublic?: boolean;
  last?: ReactNode;
  skeleton?: boolean;
}

const PageBreadcrumb = ({ isPublic, last, skeleton }: BreadcrumbsProps) => (
  <Breadcrumb.Root className="px-4 py-8">
    <Breadcrumb.List>
      <Breadcrumb.Item className="flex h-6 items-center text-fg-1">
        <Breadcrumb.Link href={isPublic ? '/' : '/subjects'}>
          <svg
            className="h-4"
            fill="currentColor"
            viewBox="0 0 400 292"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              height="217.619"
              rx="36.027"
              width="72.054"
              x="109.482"
              y=".5"
            />
            <rect
              height="144.345"
              rx="36.027"
              width="72.054"
              x="327.446"
              y="147.047"
            />
            <rect height="217.619" rx="36.027" width="72.054" x=".5" y=".5" />
            <ellipse cx="254.491" cy="182.583" rx="36.527" ry="36.036" />
          </svg>
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      {last && <Breadcrumb.Item>{last}</Breadcrumb.Item>}
      {skeleton && (
        <Breadcrumb.Item className="h-5 w-16 animate-pulse rounded-sm bg-alpha-3" />
      )}
    </Breadcrumb.List>
  </Breadcrumb.Root>
);

export default PageBreadcrumb;
