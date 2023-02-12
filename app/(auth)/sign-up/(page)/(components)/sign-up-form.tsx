'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import supabase from '(utilities)/browser-supabase-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

const SignUpForm = () => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: { email: '', firstName: '', lastName: '', password: '' },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(
        async ({ email, firstName, lastName, password }) => {
          const { error } = await supabase.auth.signUp({
            email,
            options: { data: { first_name: firstName, last_name: lastName } },
            password,
          });

          if (error) {
            alert(error.message);
          } else {
            const redirect = searchParams.get('redirect') ?? '/subjects';
            startTransition(() => router.push(decodeURIComponent(redirect)));
          }
        }
      )}
    >
      <div className="flex gap-6">
        <Label>
          <LabelSpan>First name</LabelSpan>
          <Input {...form.register('firstName')} />
        </Label>
        <Label>
          <LabelSpan>Last name</LabelSpan>
          <Input {...form.register('lastName')} />
        </Label>
      </div>
      <Label>
        <LabelSpan>Email address</LabelSpan>
        <Input type="email" {...form.register('email')} />
      </Label>
      <Label>
        <LabelSpan>Password</LabelSpan>
        <Input type="password" {...form.register('password')} />
      </Label>
      <Button
        className="mt-4 w-full"
        loading={form.formState.isSubmitting || isTransitioning}
        loadingText="Creating account…"
        type="submit"
      >
        Create account
      </Button>
    </form>
  );
};

export default SignUpForm;
