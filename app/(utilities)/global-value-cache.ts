const map = new Map();

type GlobalCacheKey =
  | 'input_form_values'
  | 'mission_form_values'
  | 'sign_in_form_values'
  | 'subject_settings_form_values'
  | 'template_form_values';

const globalValueCache = {
  get: (key: GlobalCacheKey) => map.get(key) ?? '',
  has: (key: GlobalCacheKey) => map.has(key),
  set: (key: GlobalCacheKey, value: unknown) => map.set(key, value),
};

export type { GlobalCacheKey };
export default globalValueCache;
