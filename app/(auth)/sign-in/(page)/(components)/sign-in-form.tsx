'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import supabase from '(utilities)/browser-supabase-client';
import CacheKeys from '(utilities)/enum-cache-keys';
import globalValueCache from '(utilities)/global-value-cache';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

const SignInForm = () => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

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
      <Label>
        <LabelSpan>Email address</LabelSpan>
        <Input type="email" {...form.register('email')} />
      </Label>
      <Label>
        <div className="flex justify-between">
          <LabelSpan>Password</LabelSpan>
          <Button
            className="underline"
            href="/forgot-password"
            onClick={() =>
              globalValueCache.set(CacheKeys.SignInForm, form.getValues())
            }
            variant="link"
          >
            Forgot your password?
          </Button>
        </div>
        <Input type="password" {...form.register('password')} />
      </Label>
      <Button
        className="mt-4 w-full"
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
