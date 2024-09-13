'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import signIn from '@/_mutations/sign-in';
import { useActionState } from 'react';

interface SignInFormProps {
  next?: string;
}

const SignInForm = ({ next }: SignInFormProps) => {
  const [state, action] = useActionState(signIn.bind(null, { next }), {
    defaultValues: { email: '', password: '' },
    error: '',
  });

  return (
    <form action={action} className="flex flex-col gap-8">
      <InputRoot>
        <Label.Root htmlFor="email">Email address</Label.Root>
        <Input
          defaultValue={state.defaultValues.email}
          name="email"
          required
          type="email"
        />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="password">Password</Label.Root>
        <Label.Button href="/forgot-password" tabIndex={-1}>
          Forgot password?
        </Label.Button>
        <Input
          defaultValue={state.defaultValues.password}
          minLength={6}
          name="password"
          required
          type="password"
        />
      </InputRoot>
      {state.error && <p className="text-center">{state.error}</p>}
      <Button className="mt-8 w-full" loadingText="Signing in…" type="submit">
        Sign in
      </Button>
    </form>
  );
};

export default SignInForm;
