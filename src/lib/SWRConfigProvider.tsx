'use client';

import { fetchGraphqlClient } from '@/services/graphqlCrud';
// import fetcher from '@/services/fetcher';
import { SWRConfig } from 'swr';

const SWRConfigProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (query: string) => {
          console.log(`SWRConfigProvider fetcher query:`, query);
          const { data, error } = await fetchGraphqlClient(query);
          if (error) throw new Error(error);
          return data;
        }, // Global fetcher function
        keepPreviousData: false,
        revalidateOnFocus: true, // Automatically revalidate the data when the user focuses on the component
        revalidateOnReconnect: true, // Automatically revalidate the data when the user reconnects to the internet
        revalidateIfStale: true, // Whether to validate the graph before returning the data from the fetcher function or not when the graph is stale,
        revalidateOnMount: true, // Automatically revalidate the data when the component mounts
        shouldRetryOnError: true, // Automatically retry failed requests
        errorRetryCount: 3 // Maximum number of retries for failed requests
        // dedupingInterval: 2000, // Interval in milliseconds to deduplicate requests, always trigger fetch, no dedupe window
        // refreshInterval: 300000 // auto refetch every 10 minutes

        // refreshInterval: 1000
        // suspense: false, // Enable suspense mode for lazy loading data

        // errorRetryDelay: 500 // Delay in milliseconds between retries
        // cacheSize: 100 // Maximum number of items in the cache
        // cacheExpiration: 300 // Cache expiration time in seconds
        // shouldDebounce: true // Enable debouncing for the fetcher function
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
