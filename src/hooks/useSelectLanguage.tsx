import { useMyContext } from '@/context/Store';
import { usePathname, useRouter } from '@/navigation';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

export const useSelectLanguage = () => {
  const { enProductId, arProductId } = useMyContext();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onLanguageSelectChange(event: string) {
    const nextLocale = event;
    let query = {};

    // Ensure we're on the client side before accessing window
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(
        window.location.search
      );
      query = Object.fromEntries(searchParams.entries());
    }

    startTransition(() => {
      if (params.product && typeof params.product === 'string') {
        router.replace(
          {
            pathname: `/products/${String(nextLocale === 'ar' ? arProductId : enProductId)}`
          },
          { locale: nextLocale }
        );
      } else {
        router.replace(
          {
            pathname,
            query
          },
          { locale: nextLocale }
        );
      }
    });
  }

  return { onLanguageSelectChange, isPending };
};
