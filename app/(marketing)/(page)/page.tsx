import Button from '(components)/button';
import Image from 'next/image';
import PlanImage from '../../../public/images/plan.png';
import ShareImage from '../../../public/images/share.png';
import TrackImage from '../../../public/images/track.png';

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
      <div className="flex flex-col px-6 py-24 xs:mx-auto xs:max-w-sm xs:items-center xs:text-center sm:max-w-lg lg:max-w-4xl">
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
      <div className="mx-auto grid max-w-md gap-12 px-6 py-24 text-2xl text-fg-3 lg:max-w-4xl lg:grid-cols-2">
        <figure>
          <div className="relative aspect-video overflow-hidden rounded border border-alpha-1 bg-bg-2">
            <Image alt="" quality={100} sizes="400px" src={PlanImage} />
          </div>
          <figcaption className="mt-4">
            <span className="text-fg-1">Plan.</span> Design comprehensive
            behavior modification missions.
          </figcaption>
        </figure>
        <figure>
          <div className="relative aspect-video overflow-hidden rounded border border-alpha-1 bg-bg-2">
            <Image alt="" quality={100} sizes="400px" src={ShareImage} />
          </div>
          <figcaption className="mt-4">
            <span className="text-fg-1">Share.</span> Delight clients with a
            streamlined experience.
          </figcaption>
        </figure>
        <figure>
          <div className="relative aspect-video overflow-hidden rounded border border-alpha-1 bg-bg-2">
            <Image alt="" quality={100} sizes="400px" src={TrackImage} />
          </div>
          <figcaption className="mt-4">
            <span className="text-fg-1">Track.</span> Create custom inputs &amp;
            collaboratively record data.
          </figcaption>
        </figure>
        <figure>
          <div className="flex aspect-video items-center justify-center rounded border border-alpha-2 bg-bg-1 text-base">
            Coming soon&hellip;
          </div>
          <figcaption className="mt-4">
            <span className="text-fg-1">Learn.</span> Validate hypotheses with
            powerful&nbsp;data visualizations.
          </figcaption>
        </figure>
      </div>
      <div className="mx-auto h-24 w-px bg-alpha-2" />
      <div className="flex flex-col px-6 pt-24 pb-48 xs:items-center">
        <Button href="/sign-up">Sign up to get early access</Button>
      </div>
    </main>
  </>
);

export default Page;
