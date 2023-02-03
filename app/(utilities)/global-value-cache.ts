import CacheKeys from './enum-cache-keys';

const map = new Map();

const globalValueCache = {
  get: (key: CacheKeys) => map.get(key) ?? '',
  has: (key: CacheKeys) => map.has(key),
  set: (key: CacheKeys, value: unknown) => map.set(key, value),
};

export default globalValueCache;
