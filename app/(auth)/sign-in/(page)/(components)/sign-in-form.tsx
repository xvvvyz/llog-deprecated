'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label from '(components)/label';
import supabase from '(utilities)/browser-supabase-client';
import globalValueCache from '(utilities)/global-value-cache';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

const SignInForm = () => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: globalValueCache.get('sign_in_form_values') ?? {
      email: '',
      password: '',
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async ({ email, password }) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else {
          const redirect = searchParams.get('redirect') ?? '/subjects';
          startTransition(() => router.push(decodeURIComponent(redirect)));
        }
      })}
    >
      <Label className="mt-9">
        Email address
        <Input type="email" {...form.register('email')} />
      </Label>
      <Label className="mt-6">
        <div className="flex justify-between">
          Password
          <Button
            className="underline"
            href="/forgot-password"
            onClick={() =>
              globalValueCache.set('sign_in_form_values', form.getValues())
            }
            variant="link"
          >
            Forgot your password?
          </Button>
        </div>
        <Input type="password" {...form.register('password')} />
      </Label>
      <Button
        className="mt-12 w-full"
        loading={form.formState.isSubmitting || isTransitioning}
        loadingText="Signing in…"
        type="submit"
      >
        Sign in
      </Button>
    </form>
  );
};

export default SignInForm;
