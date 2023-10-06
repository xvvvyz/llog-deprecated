import Button from '@/_components/button';

const Page = () => (
  <nav className="mx-auto flex h-full items-center justify-center gap-6 px-6">
    <Button href="/sign-in" variant="link">
      Log in
    </Button>
    <Button href="/sign-up" variant="link">
      Sign up
    </Button>
  </nav>
);

export default Page;
