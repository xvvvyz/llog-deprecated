import Button from '(components)/button';
import Image from 'next/image';

const Page = () => (
  <>
    <header className="mx-auto flex max-w-4xl items-baseline justify-between px-6 pt-8">
      <h1 className="text-2xl">
        llog<span className="text-fg-3">.app</span>
      </h1>
      <nav className="flex gap-4">
        <Button colorScheme="transparent" href="/sign-in" size="sm">
          Log in
        </Button>
        <Button colorScheme="white" href="/sign-up" size="sm">
          Sign up
        </Button>
      </nav>
    </header>
    <main>
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 lg:max-w-4xl">
        <h1 className="text-center text-3xl sm:text-4xl">
          Data-driven behavior modification made easy.{' '}
          <span className="text-fg-3">
            Plan,&nbsp;track, collaborate and&nbsp;discover.
          </span>
        </h1>
        <Button className="mt-8" href="/sign-up">
          Sign up for early access
        </Button>
      </div>
      <div className="mx-auto h-24 w-px bg-alpha-1" />
      <div className="mx-auto grid max-w-4xl gap-12 px-6 py-24 text-2xl text-fg-3 lg:grid-cols-2">
        <figure>
          <Image
            alt=""
            className="aspect-video w-full rounded border border-alpha-1 bg-bg-2"
            src=""
          />
          <figcaption className="mt-4">
            <span className="text-fg-1">Subjects.</span> Stay organized, invite
            clients and track progress.
          </figcaption>
        </figure>
        <figure>
          <Image
            alt=""
            className="aspect-video w-full rounded border border-alpha-1 bg-bg-2"
            src=""
          />
          <figcaption className="mt-4">
            <span className="text-fg-1">Templates.</span> Reuse and share
            strategies&nbsp;with the community.
          </figcaption>
        </figure>
        <figure>
          <Image
            alt=""
            className="aspect-video w-full rounded border border-alpha-1 bg-bg-2"
            src=""
          />
          <figcaption className="mt-4">
            <span className="text-fg-1">Inputs.</span> Record detailed data
            with&nbsp;user-friendly forms.
          </figcaption>
        </figure>
        <figure>
          <Image
            alt=""
            className="aspect-video w-full rounded border border-alpha-1 bg-bg-2"
            src=""
          />
          <figcaption className="mt-4">
            <span className="text-fg-1">Insights.</span> Uncover patterns with
            powerful data visualizations.
          </figcaption>
        </figure>
      </div>
      <div className="mx-auto h-24 w-px bg-alpha-1" />
      <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-24 pb-48 lg:max-w-4xl">
        <h2 className="text-center text-2xl">
          Forget spreadsheets&mdash;your clients deserve the best.
        </h2>
        <Button className="mt-8" href="/sign-up">
          Sign up for early access
        </Button>
      </div>
    </main>
  </>
);

export default Page;
