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
        fetcher: fetchGraphqlClient, // Global fetcher function
        // fetcher, // Global fetcher function
        keepPreviousData: true,
        revalidateIfStale: true, // Whether to validate the graph before returning the data from the fetcher function or not when the graph is stale,
        // refreshInterval: 3000 // Set refresh interval to 3 seconds (in milliseconds)
        revalidateOnFocus: true, // Automatically revalidate the data when the user focuses on the component
        revalidateOnReconnect: true, // Automatically revalidate the data when the user reconnects to the internet
        revalidateOnMount: false, // Automatically revalidate the data when the component mounts
        suspense: false, // Enable suspense mode for lazy loading data
        shouldRetryOnError: true, // Automatically retry failed requests

        errorRetryCount: 3 // Maximum number of retries for failed requests

        // errorRetryDelay: 500 // Delay in milliseconds between retries
        // dedupingInterval: 3000 // Interval in milliseconds to deduplicate requests
        // cacheSize: 100 // Maximum number of items in the cache
        // cacheExpiration: 300 // Cache expiration time in seconds
        // shouldDebounce: true // Enable debouncing for the fetcher function
        // debouncingInterval: 500 // Debouncing interval in milliseconds
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
