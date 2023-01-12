import Button from 'components/button';
import Card from 'components/card';
import SignUpForm from './components/sign-up-form';

const Page = () => (
  <>
    <Card breakpoint="sm">
      <h1 className="text-2xl">Create an account</h1>
      <SignUpForm />
    </Card>
    <p className="flex gap-6">
      <span className="text-fg-2">Have an account?</span>{' '}
      <Button className="underline" href="/sign-in" variant="link">
        Sign in
      </Button>
    </p>
  </>
);

export default Page;
