'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import signUp from '@/_mutations/sign-up';
import { useFormState } from 'react-dom';

interface SignUpFormProps {
  next?: string;
}

const SignUpForm = ({ next }: SignUpFormProps) => {
  const [state, action] = useFormState(signUp.bind(null, { next }), null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex gap-6">
        <Input label="First name" name="firstName" required />
        <Input label="Last name" name="lastName" required />
      </div>
      <Input label="Email address" name="email" required type="email" />
      <Input
        label="Password"
        minLength={6}
        name="password"
        required
        type="password"
      />
      {state?.error && <p className="text-center">{state.error}</p>}
      <Button
        className="mt-8 w-full"
        loadingText="Creating account…"
        type="submit"
      >
        Create account
      </Button>
    </form>
  );
};

export default SignUpForm;
