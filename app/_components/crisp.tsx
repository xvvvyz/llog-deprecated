'use client';

import { User } from '@supabase/gotrue-js/src/lib/types';
import { Crisp as C } from 'crisp-sdk-web';
import { useEffect } from 'react';

interface CrispProviderProps {
  crispSignature: string | null;
  user: User | null;
}

const Crisp = ({ crispSignature, user }: CrispProviderProps) => {
  useEffect(() => {
    const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!crispSignature || !crispWebsiteId || !user) return;
    C.configure(crispWebsiteId, { autoload: false });
    C.setTokenId(user.id);
    C.user.setEmail(user.email as string, crispSignature);
    const meta = user.user_metadata;
    C.user.setNickname(`${meta.first_name} ${meta.last_name}`);
    C.session.setSegments([meta.is_client ? 'Client' : 'Consultant'], true);
    C.load();
  }, [crispSignature, user]);

  return null;
};

export default Crisp;
