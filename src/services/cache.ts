import { clear } from 'console';

const cache = new Map<string, any>();

export async function fetchWithCache(
  url: string,
  options: { revalidate?: number } = {}
) {
  const cacheKey = `${process.env.API_BASE_URL}${url}`;

  console.log('cache');
  console.log(cache);

  // Check if data exists in the cache
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);

    // If cache is still valid, return it
    console.log(new Date(cachedData.timestamp));
    const cacheAge = Date.now() - cachedData.timestamp;
    if (cacheAge < (options.revalidate || 120000)) {
      // 5 minutes default
      return cachedData.data;
    }
  }
  // If cache is expired or doesn't exist, try to fetch new data
  try {
    const response = await fetch(cacheKey, { cache: 'no-cache' });
    const data = await response.json();
    // Save the new data to the cache with a timestamp
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    // If the fetch fails and we have cached data, return the cached data
    if (cache.has(cacheKey)) {
      console.warn('Fetch failed, serving cached data.');
      return cache.get(cacheKey).data;
    }

    // If there's no cache and fetch fails, throw an error

    throw new Error('Failed to fetch data, and no cache available.');
  }
}
