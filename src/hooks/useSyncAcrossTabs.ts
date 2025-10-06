import { useEffect } from 'react';

export function useSyncAcrossTabs(
  key: string,
  callback: (value: string | null) => void
) {
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === key) {
        callback(event.newValue);
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, callback]);
}
