import { useMyContext } from '@/context/Store';
import { usePathname } from '@/navigation';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

export const useSelectLanguage = () => {
  const { enProductId, arProductId } = useMyContext();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  // const router = useRouter();
  
  function onLanguageSelectChange(event: string) {
    const nextLocale = event;
    // let query = {};

    // // Ensure we're on the client side before accessing window
    // if (typeof window !== 'undefined') {
    //   const searchParams = new URLSearchParams(
    //     window.location.search
    //   );
    //   query = Object.fromEntries(searchParams.entries());
    // }

    // startTransition(() => {
    //   if (params.product && typeof params.product === 'string') {
    //     router.replace(
    //       {
    //         pathname: `/products/${String(nextLocale === 'ar' ? arProductId : enProductId)}`
    //       },
    //       { locale: nextLocale }
    //     );
    //   } else {
    //     router.replace(
    //       {
    //         pathname,
    //         query
    //       },
    //       { locale: nextLocale }
    //     );
    //   }
    // });

    startTransition(() => {
      let newPathname;

      // Determine the new path based on the selected locale
      if (params.product && typeof params.product === 'string') {
        newPathname = `/products/${String(nextLocale === 'ar' ? arProductId : enProductId)}`;
      } else {
        newPathname = pathname;
      }

      // Retrieve query parameters from the current URL
      let query = '';
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(
          window.location.search
        );
        query =
          searchParams.toString() ?
            `?${searchParams.toString()}`
          : '';
      }

      // Build the new URL with the locale
      const newUrl = `/${nextLocale}${newPathname}${query}`;

      // Set the new URL to reload the page
      window.location.href = newUrl;
    });
  }

  return { onLanguageSelectChange, isPending };
};
