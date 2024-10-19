import SubscriptionVariantName from '@/_constants/enum-subscription-variant-name';

const SUBSCRIPTION_VARIANT_ID_NAMES = {
  [process.env.LEMON_SQUEEZY_VARIANT_ID_PRO!]: SubscriptionVariantName.Pro,
  [process.env.LEMON_SQUEEZY_VARIANT_ID_TEAM!]: SubscriptionVariantName.Team,
};

export default SUBSCRIPTION_VARIANT_ID_NAMES;
