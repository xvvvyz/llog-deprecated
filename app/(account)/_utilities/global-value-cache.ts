import CacheKeys from '@/(account)/_constants/enum-cache-keys';

const map = new Map();

// TODO: use a better cache solution, maybe react context?
const globalValueCache = {
  get: (key: CacheKeys) => map.get(key) ?? '',
  has: (key: CacheKeys) => map.has(key),
  set: (key: CacheKeys, value: unknown) => map.set(key, value),
};

export default globalValueCache;
