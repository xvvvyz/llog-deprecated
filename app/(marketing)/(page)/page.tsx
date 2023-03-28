import Button from '(components)/button';

const Page = () => (
  <>
    <header className="mx-auto flex max-w-4xl items-baseline justify-between px-6 pt-8">
      <h1 className="text-2xl">
        llog<span className="text-fg-3">.app</span>
      </h1>
      <Button colorScheme="transparent" href="/sign-in" size="sm">
        Log in
      </Button>
    </header>
    <main>
      <div className="flex flex-col px-6 py-24 xs:mx-auto xs:max-w-sm xs:items-center xs:text-center sm:max-w-lg lg:max-w-3xl">
        <h1 className="text-2xl sm:text-3xl">
          <span className="text-fg-3">
            Refine your animal behavior consulting business with
          </span>{' '}
          collaborative, data-driven behavior modification.
        </h1>
        <Button className="mt-8" href="/sign-up">
          Sign up to get early access
        </Button>
      </div>
      <div className="mx-auto h-24 w-px bg-alpha-2" />
      <div className="mx-auto max-w-lg space-y-32 px-6 py-24 text-2xl text-fg-3 xs:text-center">
        <p>
          <span className="text-fg-1">Plan.</span> Design comprehensive
          behavior&nbsp;modification&nbsp;missions.
        </p>
        <div className="mx-auto h-24 w-px bg-alpha-2" />
        <p>
          <span className="text-fg-1">Share.</span> Delight clients with a
          streamlined&nbsp;experience.
        </p>
        <div className="mx-auto h-24 w-px bg-alpha-2" />
        <p>
          <span className="text-fg-1">Track.</span> Create custom inputs &amp;
          collaboratively&nbsp;record&nbsp;data.
        </p>
        <div className="mx-auto h-24 w-px bg-alpha-2" />
        <p>
          <span className="text-fg-1">Learn.</span> Validate hypotheses with
          visualizations&nbsp;&amp;&nbsp;insights.
        </p>
      </div>
      <div className="mx-auto h-24 w-px bg-alpha-2" />
      <div className="flex flex-col px-6 pb-48 pt-24 xs:items-center">
        <Button href="/sign-up">Sign up to get early access</Button>
      </div>
    </main>
  </>
);

export default Page;
