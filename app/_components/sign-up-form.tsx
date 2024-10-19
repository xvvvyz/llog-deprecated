'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import signUp from '@/_mutations/sign-up';
import { useActionState } from 'react';

interface SignUpFormProps {
  next?: string;
}

const SignUpForm = ({ next }: SignUpFormProps) => {
  const [state, action] = useActionState(signUp.bind(null, { next }), {
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      organization: '',
      password: '',
    },
    error: '',
  });

  const isClient = !!next?.includes('/join/');

  return (
    <form action={action} className="flex flex-col gap-8">
      <div className="flex gap-6">
        <InputRoot>
          <Label.Root htmlFor="firstName">First name</Label.Root>
          <Input
            defaultValue={state.defaultValues.firstName}
            name="firstName"
            required
          />
        </InputRoot>
        <InputRoot>
          <Label.Root htmlFor="lastName">Last name</Label.Root>
          <Input
            defaultValue={state.defaultValues.lastName}
            name="lastName"
            required
          />
        </InputRoot>
      </div>
      {!isClient && (
        <InputRoot>
          <Label.Root htmlFor="organization">
            Organization <span className="text-fg-4">(optional)</span>
          </Label.Root>
          <Input
            defaultValue={state.defaultValues.organization}
            name="organization"
          />
        </InputRoot>
      )}
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
        <Input
          defaultValue={state.defaultValues.password}
          minLength={6}
          name="password"
          required
          type="password"
        />
      </InputRoot>
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
