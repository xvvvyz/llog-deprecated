import Button from '@/_components/button';
import SignInForm from '@/_components/sign-in-form';

export const metadata = { title: 'Sign in' };

interface PageProps {
  searchParams: {
    next?: string;
  };
}

const Page = ({ searchParams: { next } }: PageProps) => (
  <>
    <div className="w-full sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
      <h1 className="mb-10 text-2xl">Welcome back</h1>
      <SignInForm next={next} />
    </div>
    <p className="flex gap-4">
      <span className="text-fg-4">Don&rsquo;t have an account?</span>
      <Button href={`/sign-up${next ? `?next=${next}` : ''}`} variant="link">
        Sign up
      </Button>
    </p>
  </>
);

export default Page;
