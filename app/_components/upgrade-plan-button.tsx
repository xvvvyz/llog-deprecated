'use client';

import Button from '@/_components/button';
import SubscriptionStatus from '@/_constants/enum-subscription-status';
import createCustomerCheckout from '@/_mutations/create-customer-checkout';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

interface UpgradePlanButtonProps {
  user: User;
}

const UpgradePlanButton = ({ user }: UpgradePlanButtonProps) => {
  const [isBillingRedirectLoading, setIsBillingRedirectLoading] =
    useState(false);

  return (
    <Button
      className="w-full"
      disabled={
        user.app_metadata.subscription_status === SubscriptionStatus.Active
      }
      loading={isBillingRedirectLoading}
      loadingText="Redirecting…"
      onClick={async (e) => {
        e.preventDefault();
        setIsBillingRedirectLoading(true);
        const { url } = await createCustomerCheckout();
        if (url) location.href = url;
        else setIsBillingRedirectLoading(false);
      }}
    >
      Upgrade
    </Button>
  );
};

export default UpgradePlanButton;
