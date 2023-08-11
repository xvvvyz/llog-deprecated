import Button from '@/_components/button';
import { PhotoIcon, PlayIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import pugPng from './_images/pug.png';

const Page = () => (
  <div>
    <nav className="mx-auto flex max-w-5xl items-baseline justify-between px-6 pt-8">
      <Button className="text-3xl font-bold text-fg-1" href="/" variant="link">
        llog.app
      </Button>
      <div className="flex items-baseline gap-6">
        <Button colorScheme="transparent" href="/sign-in" size="sm">
          Log in
        </Button>
        <Button className="hidden sm:block" href="/sign-up" size="sm">
          Sign up
        </Button>
      </div>
    </nav>
    <header>
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="mx-auto max-w-[21rem] text-5xl font-bold text-fg-1 md:max-w-2xl lg:max-w-3xl lg:text-6xl">
          The ultimate platform for behavior consultants
        </h1>
        <p className="mx-auto mt-8 max-w-[21rem] text-fg-4">
          Collaboratively track behavior with clients, save time and
          deliver&nbsp;incredible&nbsp;results.
        </p>
        <Button className="mt-10 w-full shrink-0 sm:w-auto" href="/sign-up">
          Get early access
        </Button>
      </div>
      <div className="before:content-[' '] relative before:absolute before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:border-b before:border-b-alpha-1">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex aspect-video w-full items-center justify-center rounded border border-alpha-1 bg-bg-2">
            <PlayIcon className="w-11" />
          </div>
        </div>
      </div>
    </header>
    <main>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-fg-1">
            Planning, tracking and analyzing,&nbsp;simplified
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-fg-4">
            Packed with stunningly simple yet powerful features, we
            built&nbsp;llog to make working together towards
            behavioral&nbsp;goals&nbsp;a&nbsp;pure&nbsp;joy.
          </p>
        </div>
        <div className="mt-24 grid gap-x-12 gap-y-10 lg:grid-cols-2">
          <div>
            <div className="sm:pl-4">
              <h2 className="text-xl font-bold text-fg-1">
                Manage clients from anywhere
              </h2>
              <p className="mt-2 max-w-sm text-fg-4">
                Choose where and when you work with your clients. Pre-schedule
                training sessions so your clients are ready to take on
                every&nbsp;new&nbsp;day.
              </p>
            </div>
            <div className="mt-5 flex aspect-video w-full items-center justify-center rounded border border-alpha-1 bg-bg-2">
              <PhotoIcon className="w-11" />
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:flex-col-reverse">
            <div className="sm:pl-4">
              <h2 className="text-xl font-bold text-fg-1">
                Record what matters most
              </h2>
              <p className="mt-2 max-w-sm text-fg-4">
                Fully customizable and reusable inputs give you the freedom to
                track pretty&nbsp;much&nbsp;anything. If you can imagine it, you
                can track it.
              </p>
            </div>
            <div className="flex aspect-video w-full items-center justify-center rounded border border-alpha-1 bg-bg-2">
              <PhotoIcon className="w-11" />
            </div>
          </div>
          <div>
            <div className="sm:pl-4">
              <h2 className="text-xl font-bold text-fg-1">
                Keep an eye on every event
              </h2>
              <p className="mt-2 max-w-sm text-fg-4">
                Live activity timelines and real-time notifications keep you
                right on top of client progress, day in day out. You will
                never&nbsp;miss&nbsp;a&nbsp;beat.
              </p>
            </div>
            <div className="mt-5 flex aspect-video w-full items-center justify-center rounded border border-alpha-1 bg-bg-2">
              <PhotoIcon className="w-11" />
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:flex-col-reverse">
            <div className="sm:pl-4">
              <h2 className="text-xl font-bold text-fg-1">
                Extract valuable insights
              </h2>
              <p className="mt-2 max-w-sm text-fg-4">
                Spot trends and anomalies with our AI-powered data visualization
                assistant. Stop guessing and start making
                data-driven&nbsp;decisions.
              </p>
            </div>
            <div className="flex aspect-video w-full items-center justify-center rounded border border-alpha-1 bg-bg-2">
              <PhotoIcon className="w-11" />
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-alpha-1">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-fg-1">
            Get started in minutes, no strings&nbsp;attached
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-fg-4">
            We will get you set up in no time. Sign up for free and
            start&nbsp;building your dream online behavior
            consulting&nbsp;business&nbsp;today.
          </p>
          <Button className="mt-8 w-full sm:w-auto" href="/sign-up">
            Get early access
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="mx-auto max-w-xs text-center text-3xl font-bold text-fg-1 sm:max-w-full">
          Frequently asked questions
        </h1>
        <ul className="mt-24 grid gap-6 xl:grid-cols-2 xl:gap-12">
          <li className="rounded border border-alpha-1 bg-bg-2 px-8 py-6">
            <h2 className="text-xl font-bold text-fg-1">
              What is early access?
            </h2>
            <p className="mt-2 max-w-sm text-fg-4">
              We are reaching out to a small number of people to get feedback
              and help us shape&nbsp;llog&rsquo;s&nbsp;future.
            </p>
          </li>
          <li className="rounded border border-alpha-1 bg-bg-2 px-8 py-6">
            <h2 className="text-xl font-bold text-fg-1">
              Can I export my data?
            </h2>
            <p className="mt-2 max-w-sm text-fg-4">
              Yes, you can export your data at any time via CSV. We can create
              custom exports&nbsp;upon&nbsp;request.
            </p>
          </li>
        </ul>
        <p className="mt-24 text-center text-fg-4">
          Still have questions? Let&rsquo;s talk.
          <br />
          <Button variant="link" href="mailto:contact@llog.app">
            Email us
          </Button>{' '}
          or{' '}
          <Button variant="link" href="https://cal.com/xvvvyz/llog-demo">
            schedule a call
          </Button>
          .
        </p>
      </section>
    </main>
    <footer className="border-t border-alpha-1">
      <div className="relative mx-auto max-w-5xl px-6 pt-24">
        <div className="flex flex-col items-center gap-12">
          <Button
            className="text-3xl font-bold text-fg-1"
            href="/"
            variant="link"
          >
            llog.app
          </Button>
          <div className="flex flex-col items-center gap-3">
            <Button variant="link" href="#">
              Terms of service
            </Button>
            <Button variant="link" href="#">
              Privacy policy
            </Button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Button href="/sign-up" variant="link">
              Sign up
            </Button>
            <Button href="/sign-in" variant="link">
              Log in
            </Button>
          </div>
          <Image alt="" quality={100} src={pugPng} width="200" />
        </div>
      </div>
    </footer>
  </div>
);

export default Page;
