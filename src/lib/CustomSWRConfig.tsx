'use client';

import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { SWRConfig } from 'swr';

const CustomSWRConfig = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetchGraphqlClient, // Global fetcher function
        keepPreviousData: true
        // refreshInterval: 3600000 // Set refresh interval to 1 hour (in milliseconds)
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default CustomSWRConfig;
