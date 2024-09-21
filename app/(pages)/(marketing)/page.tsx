import Button from '@/_components/button';
import ContactForm from '@/_components/contact-form';

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
      Streamline <b>data collection</b>, create <b>data-driven protocols</b> and
      easily <b>monitor&nbsp;progress</b>.
    </p>
    <div className="mt-9 w-full max-w-lg rounded border border-alpha-1 bg-bg-2 p-8 text-left sm:rounded-[4rem] sm:p-16">
      <ContactForm />
    </div>
    <p className="mt-9 flex justify-center gap-4">
      <span className="text-fg-4">Have an account?</span>
      <Button href="/sign-in" variant="link">
        Sign in
      </Button>
    </p>
  </div>
);

export default Page;
