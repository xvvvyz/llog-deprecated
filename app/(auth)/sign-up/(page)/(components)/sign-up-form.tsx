'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import supabase from '(utilities)/browser-supabase-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

const SignUpForm = () => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = decodeURIComponent(
    searchParams.get('redirect') ?? '/subjects'
  );

  const form = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      isClient: redirect.includes('/join/'),
      lastName: '',
      password: '',
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(
        async ({ email, firstName, isClient, lastName, password }) => {
          const { error } = await supabase.auth.signUp({
            email,
            options: {
              data: {
                first_name: firstName,
                is_client: isClient,
                last_name: lastName,
              },
            },
            password,
          });

          if (error) {
            alert(error.message);
          } else {
            startTransition(() => router.push(redirect));
          }
        }
      )}
    >
      <div className="flex gap-6">
        <Input label="First name" {...form.register('firstName')} />
        <Input label="Last name" {...form.register('lastName')} />
      </div>
      <Input label="Email address" type="email" {...form.register('email')} />
      <Input label="Password" type="password" {...form.register('password')} />
      <Button
        className="mt-8 w-full"
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
