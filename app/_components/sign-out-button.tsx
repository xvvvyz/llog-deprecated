'use client';

import Button from '@/_components/button';
import useSupabase from '@/_hooks/use-supabase';
import { useBoolean } from 'usehooks-ts';

const SignOutButton = () => {
  const isSigningOut = useBoolean();
  const supabase = useSupabase();

  return (
    <Button
      className="w-32 shrink-0 justify-end text-fg-2"
      loading={isSigningOut.value}
      loadingText="Goodbye…"
      onClick={async () => {
        isSigningOut.setTrue();
        await supabase.auth.signOut();
      }}
      variant="link"
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
