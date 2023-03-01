'use client';

import Button from '(components)/button';
import supabase from '(utilities)/browser-supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignOutButton = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Button
      className="shrink-0 justify-end text-fg-2"
      loading={isSigningOut}
      loadingText="Goodbye…"
      onClick={async () => {
        setIsSigningOut(true);
        await supabase.auth.signOut();
        router.push('/');
      }}
      variant="link"
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
