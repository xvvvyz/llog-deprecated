'use client';

import IconButton from '@/(account)/_components/icon-button';
import useSupabase from '@/_hooks/use-supabase';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useBoolean } from 'usehooks-ts';

const SignOutButton = () => {
  const isSigningOut = useBoolean();
  const supabase = useSupabase();

  return (
    <IconButton
      icon={<ArrowLeftOnRectangleIcon className="w-7" />}
      loading={isSigningOut.value}
      onClick={async () => {
        isSigningOut.setTrue();
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
