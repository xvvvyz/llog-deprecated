import SubscriptionVariantName from '@/_constants/enum-subscription-variant-name';

const SUBSCRIPTION_VARIANT_NAME_IDS = {
  [SubscriptionVariantName.Pro]: process.env.LEMON_SQUEEZY_VARIANT_ID_PRO!,
  [SubscriptionVariantName.Team]: process.env.LEMON_SQUEEZY_VARIANT_ID_TEAM!,
};

export default SUBSCRIPTION_VARIANT_NAME_IDS;
