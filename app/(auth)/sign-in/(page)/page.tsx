import Button from '(components)/button';
import SignInForm from './(components)/sign-in-form';

const Page = () => (
  <>
    <div className="w-full sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
      <h1 className="mb-8 text-2xl">Welcome back</h1>
      <SignInForm />
    </div>
    <p className="flex gap-6">
      <span className="text-fg-3">Don&rsquo;t have an account?</span>
      <Button forwardSearchParams href="/sign-up" variant="link">
        Sign up
      </Button>
    </p>
  </>
);

export const metadata = { title: 'Sign in' };
export default Page;
