'use client';

import signIn from '@/_actions/sign-in';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { useFormState } from 'react-dom';

interface SignInFormProps {
  next?: string;
}

const SignInForm = ({ next }: SignInFormProps) => {
  const [state, action] = useFormState(signIn.bind(null, { next }), null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <Input label="Email address" name="email" required type="email" />
      <div className="relative">
        <Input
          label="Password"
          minLength={6}
          name="password"
          required
          type="password"
        />
        <Button
          className="absolute right-2 top-0"
          href="/forgot-password"
          variant="link"
        >
          Forgot password?
        </Button>
      </div>
      {state?.error && <p className="text-center">{state.error}</p>}
      <Button className="mt-8 w-full" loadingText="Signing in…" type="submit">
        Sign in
      </Button>
    </form>
  );
};

export default SignInForm;
