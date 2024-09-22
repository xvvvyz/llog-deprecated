import Button from '@/_components/button';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';

const Page = () => (
  <div className="mx-auto flex min-h-full max-w-2xl select-text flex-col items-center justify-center px-6 py-16 text-center">
    <svg
      className="size-16"
      fill="none"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#f7bb08" height="1000" rx="500" width="1000" />
      <g fill="#1f1f1f">
        <rect
          height="217.619"
          rx="36.0269"
          stroke="#1f1f1f"
          width="72.0539"
          x="409.482"
          y="354.5"
        />
        <rect
          height="144.345"
          rx="36.0269"
          stroke="#1f1f1f"
          width="72.0539"
          x="627.446"
          y="501.047"
        />
        <rect
          height="217.619"
          rx="36.0269"
          stroke="#1f1f1f"
          width="72.0539"
          x="300.5"
          y="354.5"
        />
        <ellipse cx="554.491" cy="536.583" rx="36.5269" ry="36.036" />
      </g>
    </svg>
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
