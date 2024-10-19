'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { v4 } from 'uuid';

const signUp = async (
  context: { next?: string },
  _state: {
    defaultValues: {
      email: string;
      firstName: string;
      lastName: string;
      organization: string;
      password: string;
    };
    error: string;
  },
  data: FormData,
) => {
  const { get } = await headers();
  const email = data.get('email') as string;
  const firstName = (data.get('firstName') as string).trim();
  const host = get('host');
  const isClient = !!context.next?.includes('/join/');
  const lastName = (data.get('lastName') as string).trim();
  const organization = (data.get('organization') as string)?.trim();
  const password = data.get('password') as string;
  const proto = get('x-forwarded-proto');
  const teamId = v4();

  const {
    data: { user },
    error,
  } = await (
    await createServerSupabaseClient()
  ).auth.signUp({
    email,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        organization,
        team_id: teamId,
      },
      emailRedirectTo: `${proto}://${host}${context.next ? context.next : isClient ? '/subjects' : '/hey'}`,
    },
    password,
  });

  if (error || !user) {
    return {
      defaultValues: { email, firstName, lastName, organization, password },
      error: error?.message ?? 'An error occurred',
    };
  }

  await (
    await createServerSupabaseClient({
      apiKey: process.env.SUPABASE_SERVICE_KEY!,
    })
  ).auth.admin.updateUserById(user.id, {
    app_metadata: { active_team_id: teamId, is_client: isClient },
    user_metadata: { organization: null, team_id: null },
  });

  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'system@llog.app',
    html: `<pre>${JSON.stringify(
      {
        email,
        firstName,
        isClient,
        lastName,
        organization,
      },
      null,
      2,
    )}</pre>`,
    subject: 'New llog sign up',
    to: ['cade@llog.app'],
  });

  redirect('/confirmation-sent');
};

export default signUp;
