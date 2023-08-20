'use client';

import { User } from '@supabase/gotrue-js/src/lib/types';
import { Crisp } from 'crisp-sdk-web';
import { ReactNode, useEffect } from 'react';

interface CrispProviderProps {
  children: ReactNode;
  crispSignature?: string;
  user: User | null;
}

const CrispProvider = ({
  children,
  crispSignature,
  user,
}: CrispProviderProps) => {
  useEffect(() => {
    const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!crispSignature || !crispWebsiteId || !user) return;
    Crisp.configure(crispWebsiteId, { autoload: false });
    Crisp.setTokenId(user.id);
    Crisp.user.setEmail(user.email as string, crispSignature);
    const meta = user.user_metadata;
    Crisp.user.setNickname(`${meta.first_name} ${meta.last_name}`);
    Crisp.session.setData({ is_client: meta.is_client });
    Crisp.load();
  }, [crispSignature, user]);

  return children;
};

export default CrispProvider;
