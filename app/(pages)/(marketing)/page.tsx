import Button from '@/_components/button';
import ContactForm from '@/_components/contact-form';

const Page = () => (
  <div className="mx-auto flex min-h-full max-w-2xl select-text flex-col items-center justify-center px-6 py-16 text-center">
    <h1 className="max-w-sm text-2xl font-bold md:max-w-xl md:text-4xl">
      <span className="text-fg-1">llog</span>&mdash;achieve lasting behavior
      changes with your&nbsp;clients.
    </h1>
    <p className="mx-auto mt-6 max-w-sm">
      Streamline <b>data collection</b>, create{' '}
      <b>data-driven training plans</b> and easily <b>monitor&nbsp;progress</b>.
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
