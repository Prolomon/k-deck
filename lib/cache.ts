import NodeCache from "node-cache";

// Standard in-memory cache with 10-minute default TTL and checkperiod of 120s
declare global {
  // eslint-disable-next-line no-var
  var __kdeck_app_cache: NodeCache | undefined;
}

const appCache =
  global.__kdeck_app_cache ||
  new NodeCache({
    stdTTL: 600, // 10 minutes
    checkperiod: 120,
    useClones: false,
  });

if (process.env.NODE_ENV !== "production") {
  global.__kdeck_app_cache = appCache;
}

export const Cache = {
  get<T>(key: string): T | undefined {
    return appCache.get<T>(key);
  },

  set(key: string, value: unknown, ttlSeconds = 600): boolean {
    return appCache.set(key, value, ttlSeconds);
  },

  del(key: string): number {
    return appCache.del(key);
  },

  flush(): void {
    appCache.flushAll();
  },

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds = 600
  ): Promise<T> {
    const cached = appCache.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }
    const fresh = await fetchFn();
    appCache.set(key, fresh, ttlSeconds);
    return fresh;
  },
};

export default Cache;
