'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import signUp from '@/_mutations/sign-up';
import { useActionState } from 'react';

interface SignUpFormProps {
  next?: string;
}

const SignUpForm = ({ next }: SignUpFormProps) => {
  const [state, action] = useActionState(signUp.bind(null, { next }), {
    defaultValues: { email: '', firstName: '', lastName: '', password: '' },
    error: '',
  });

  return (
    <form action={action} className="flex flex-col gap-8">
      <div className="flex gap-6">
        <Input
          defaultValue={state.defaultValues.firstName}
          label="First name"
          name="firstName"
          required
        />
        <Input
          defaultValue={state.defaultValues.lastName}
          label="Last name"
          name="lastName"
          required
        />
      </div>
      <Input
        defaultValue={state.defaultValues.email}
        label="Email address"
        name="email"
        required
        type="email"
      />
      <Input
        defaultValue={state.defaultValues.password}
        label="Password"
        minLength={6}
        name="password"
        required
        type="password"
      />
      {state.error && <p className="text-center">{state.error}</p>}
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
