'use client';

import IconButton from '@/_components/icon-button';
import useSupabase from '@/_hooks/use-supabase';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useToggle } from '@uidotdev/usehooks';

const SignOutButton = () => {
  const [isSigningOut, toggleIsSigningOut] = useToggle(false);
  const supabase = useSupabase();

  return (
    <IconButton
      icon={<ArrowLeftOnRectangleIcon className="w-7" />}
      loading={isSigningOut}
      onClick={async () => {
        toggleIsSigningOut();
        await supabase.auth.signOut();
      }}
      spinnerClassName="w-7 h-7"
      variant="link"
    >
      Sign out
    </IconButton>
  );
};

export default SignOutButton;
