const map = new Map();

type GlobalCacheKeys =
  | 'sign_in_form_values'
  | 'subject_settings_form_values'
  | 'template_form_values';

const globalValueCache = {
  get: (key: GlobalCacheKeys) => map.get(key) ?? '',
  has: (key: GlobalCacheKeys) => map.has(key),
  set: (key: GlobalCacheKeys, value: unknown) => map.set(key, value),
};

export type { GlobalCacheKeys };
export default globalValueCache;
