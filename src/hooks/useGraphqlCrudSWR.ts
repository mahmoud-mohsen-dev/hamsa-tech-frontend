import useSWR from 'swr';

export function useGraphqlCrudSWR(query: string) {
  return useSWR(query);
}
