'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import CacheKeys from '(utilities)/enum-cache-keys';
import globalValueCache from '(utilities)/global-value-cache';
import useSupabase from '(utilities)/use-supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

const SignInForm = () => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useSupabase();

  const form = useForm({
    defaultValues: globalValueCache.get(CacheKeys.SignInForm) ?? {
      email: '',
      password: '',
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
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
      <Input label="Email address" type="email" {...form.register('email')} />
      <div className="relative">
        <Input
          label="Password"
          type="password"
          {...form.register('password')}
        />
        <Button
          className="absolute right-2 top-0"
          forwardSearchParams
          href="/forgot-password"
          onClick={() =>
            globalValueCache.set(CacheKeys.SignInForm, form.getValues())
          }
          variant="link"
        >
          Forgot your password?
        </Button>
      </div>
      <Button
        className="mt-8 w-full"
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
