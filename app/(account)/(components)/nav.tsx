'use client';

import Button from '(components)/button';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import SignOutButton from './sign-out-button';

const Nav = () => {
  const searchParams = useSearchParams();

  return (
    <nav
      className={twMerge(
        'flex items-start justify-between gap-2 pt-8 leading-none text-fg-2',
        searchParams.has('back') && 'disabled'
      )}
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-4">
          <Button activeClassName="text-fg-1" href="/subjects" variant="link">
            Subjects
          </Button>
          <Button activeClassName="text-fg-1" href="/templates" variant="link">
            Templates
          </Button>
        </div>
        <div className="flex gap-4">
          <Button activeClassName="text-fg-1" href="/inputs" variant="link">
            Inputs
          </Button>
          {/*<Button activeClassName="text-fg-1" variant="link">*/}
          {/*  Insights*/}
          {/*</Button>*/}
        </div>
      </div>
      <SignOutButton />
    </nav>
  );
};

export default Nav;
