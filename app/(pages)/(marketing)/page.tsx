import Button from '@/_components/button';
import Logo from '@/_components/logo';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';

const Page = () => (
  <div className="mx-auto flex min-h-full max-w-2xl select-text flex-col items-center justify-center px-6 py-16 text-center">
    <Logo className="size-16" />
    <h1 className="mt-14 max-w-sm text-2xl font-bold md:max-w-xl md:text-4xl">
      <span className="text-fg-1">llog</span>&mdash;achieve lasting behavior
      changes with your&nbsp;clients.
    </h1>
    <p className="mx-auto mt-6 max-w-sm">
      Streamline <span className="font-bold text-fg-1">data collection</span>,
      create <span className="font-bold text-fg-1">data-driven protocols</span>{' '}
      and easily{' '}
      <span className="font-bold text-fg-1">monitor&nbsp;progress</span>.
    </p>
    <Button
      className="mt-8 pl-5"
      colorScheme="transparent"
      href="https://cal.com/llogapp/demo"
    >
      Schedule a demo
      <ArrowUpRightIcon className="w-5" />
    </Button>
    <Button className="absolute right-8 top-6" href="/sign-in" variant="link">
      Sign in
    </Button>
  </div>
);

export default Page;
