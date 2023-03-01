import Button from '(components)/button';
import SignOutButton from './sign-out-button';

interface NavProps {
  isClient: boolean;
}

const Nav = ({ isClient }: NavProps) => (
  <nav className="flex items-start justify-between gap-4 pt-8 leading-none text-fg-2">
    <div className="flex flex-wrap gap-4">
      <div className="flex gap-4">
        <Button activeClassName="text-fg-1" href="/subjects" variant="link">
          Subjects
        </Button>
        {!isClient && (
          <Button activeClassName="text-fg-1" href="/templates" variant="link">
            Templates
          </Button>
        )}
      </div>
      {!isClient && (
        <div className="flex gap-4">
          <Button activeClassName="text-fg-1" href="/inputs" variant="link">
            Inputs
          </Button>
          <Button activeClassName="text-fg-1" disabled variant="link">
            Insights
          </Button>
        </div>
      )}
    </div>
    <SignOutButton />
  </nav>
);

export default Nav;
