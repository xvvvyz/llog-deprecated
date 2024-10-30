'use client';

import Button from '@/_components/button';
import SubscriptionVariantName from '@/_constants/enum-subscription-variant-name';
import createCustomerCheckout from '@/_mutations/create-customer-checkout';
import { useState } from 'react';

interface CheckoutButtonProps {
  disabled?: boolean;
  teamId: string;
  variant: SubscriptionVariantName;
}

const CheckoutButton = ({ disabled, teamId, variant }: CheckoutButtonProps) => {
  const [isBillingRedirectLoading, setIsBillingRedirectLoading] =
    useState(false);

  return (
    <Button
      className="w-full"
      disabled={disabled}
      loading={isBillingRedirectLoading}
      loadingText="Redirecting…"
      onClick={async (e) => {
        e.preventDefault();
        setIsBillingRedirectLoading(true);

        const { url } = await createCustomerCheckout({
          teamId,
          variant,
        });

        if (url) location.href = url;
        else setIsBillingRedirectLoading(false);
      }}
    >
      Continue
    </Button>
  );
};

export default CheckoutButton;
